import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { ApiError, constants, sendResponse } from '../utils';
import { Scan } from '../models/ScanModel';
import { ScanResult } from '../models/ScanResultModel';
import { Target } from '../models/TargetModel';
import { Project } from '../models/ProjectModel';
import { parseVAJson } from '../services/reportParser/jsonParser';
import { parseZapXml } from '../services/reportParser/xmlParser';
import path from 'path';
import config from '@config/config';
import { ScanStats, SeverityLevel } from '../types/reportTypes';

/**
 * @description Get the report path and little details of a Scan
 * @route GET /scan/:scanId/completed
 * @access private
 */
export const getCompletedScan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { scanId } = req.params;
    if (!scanId) {
      throw new ApiError(constants.BAD_REQUEST, 'ScanId not found.');
    }

    const scanResult = await Scan.findByPk(scanId, {
      attributes: ['id', 'state', 'targetId', 'start_time', 'end_time'],
      include: [
        {
          model: ScanResult,
          as: 'scanResults',
          attributes: ['id', 'scanId', 'vulnerabilityType', 'severity', 'description'],
          order: [['id', 'DESC']],
        },
      ],
    });
    if (!scanResult) {
      throw new ApiError(constants.BAD_REQUEST, 'Scan not found.');
    }
    if (scanResult.state !== 'done') {
      throw new ApiError(constants.BAD_REQUEST, 'Scan not completed yet.');
    }

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Path to report',
      data: scanResult,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Get the full report of a completed Scan
 * @route GET /report/:scanId/full
 * @access private
 */
export const getFullReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scanId } = req.params;
    const userId = req.user?.id;

    if (!scanId) {
      throw new ApiError(constants.BAD_REQUEST, 'ScanId not found.');
    }

    // 1. Recupero metadati del report
    const scan = await Scan.findByPk(scanId, {
      include: [
        {
          model: Target,
          //   as: 'targets',
          attributes: ['id', 'domain', 'ip_domain', 'projectId'],
          include: [
            {
              model: Project,
              //   as: 'projects',
              attributes: ['id', 'name', 'userId'],
            },
          ],
        },
      ],
    });

    if (!scan) {
      throw new ApiError(constants.BAD_REQUEST, 'Report not found.');
    }

    const scanData = await Scan.findByPk(scanId, {
      include: [
        {
          model: ScanResult,
          as: 'scanResults',
          attributes: ['id', 'vulnerabilityType', 'severity'],
        },
      ],
    });

    if (!scanData) {
      throw new ApiError(constants.BAD_REQUEST, 'Cannot connect to database.');
    }

    // Inizializziamo i contatori a 0
    const stats: ScanStats = {
      bySeverity: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
      byType: { va: 0, pt: 0 },
    };

    // Se ci sono risultati, cicliamo una sola volta
    const results = scanData?.scanResults || [];

    results.forEach((result) => {
      // 1. Calcolo Severity
      // Normalizziamo in lowercase per sicurezza e gestiamo eventuali null
      const severityKey = (result.severity?.toLowerCase() || 'info') as SeverityLevel;

      // Se la chiave esiste nel nostro oggetto, incrementiamo
      if (stats.bySeverity[severityKey] !== undefined) {
        stats.bySeverity[severityKey]++;
      }

      // 2. Calcolo Tipo (VA vs PT)
      const vType = result.vulnerabilityType || '';
      // Se contiene "CVE-" (ignorando maiuscole/minuscole) è VA, altrimenti PT
      if (vType.toUpperCase().includes('CVE-')) {
        stats.byType.va++;
      } else {
        stats.byType.pt++;
      }
    });

    // 2. Controllo di autorizzazione:
    // L’utente deve essere il proprietario del progetto
    if (scan.target.project.userId !== userId) {
      throw new ApiError(
        constants.FORBIDDEN,
        'Access Denied. You ar not the owner of this report.'
      );
    }

    // 3. Estraggo i campi utili
    const meta = {
      reportId: scan.id,
      timestamp: scan.endTime,
      status: scan.state,
      jsonPath: scan.reportPath,
      xmlPath: scan.pentestPath,
      target: {
        id: scan.target.id,
        domain: scan.target.domain,
        ipv4: scan.target.ip_domain,
        server: 'N/A',
        statusCode: 'N/A',
        allowedMethods: 'N/A',
      },
      project: {
        id: scan.target.project.id,
        name: scan.target.project.name,
      },
      totVuln: {
        bySeverity: {
          critical: stats.bySeverity.critical,
          high: stats.bySeverity.high,
          medium: stats.bySeverity.medium,
          low: stats.bySeverity.low,
          info: stats.bySeverity.info,
        },
        byType: {
          va: stats.byType.va,
          pt: stats.byType.pt,
        },
      },
    };

    let vaData, ptData;
    // 4. Controlo che i percorsi esistano
    if (meta.jsonPath) {
      // 5. Ricavo il report completo di Vulnerability Assessment
      const fullJsonPath = path.join(config.SCAN_BASE_PATH, meta.jsonPath);

      vaData = await parseVAJson(fullJsonPath);
      // console.log('VA INFO?', JSON.stringify(vaData.info, null, 2));

      // 5.1 Estraggo e sposto dentro meta
      if (vaData.info) {
        meta.target.server = vaData.info.server;
        meta.target.statusCode = vaData.info.statusCode;
        meta.target.allowedMethods = vaData.info.allowed_methods;
        delete (vaData as any).info; // rimuovo per evitare strutture duplicate
      }

      console.log('server: ', meta.target.server, ', status code: ', meta.target.statusCode);
    }

    if (meta.xmlPath) {
      // 6. Ricavo il report completo di Penetration Testing
      const fullXmlPath = path.join(config.SCAN_BASE_PATH, meta.xmlPath);

      ptData = await parseZapXml(fullXmlPath);
    }

    // 7. Mando la risposta
    // Prima unisco i dati
    const fullReport = {
      meta,
      va: vaData,
      pt: ptData,
    };

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Full Report data',
      data: fullReport,
    });
  } catch (err) {
    next(err);
  }
};
