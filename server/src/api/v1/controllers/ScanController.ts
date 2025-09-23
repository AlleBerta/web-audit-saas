import { Response, NextFunction } from 'express';
import { sendResponse, ApiError, constants } from '../utils/';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { Scan } from '../models/ScanModel';

/**
 * @description Create one Project from user
 * @route POST /project/
 * @access private
 */
export const createScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return sendResponse(res, {
        statusCode: constants.UNAUTHORIZED,
        success: false,
        message: 'Utente non autenticato.',
      });
    }

    let { domain, projectId } = req.body;
    domain = !domain || typeof domain !== 'string' ? '' : domain.trim();
    if (!projectId) {
      throw new ApiError(constants.BAD_REQUEST, 'Target associato ad un progetto non valido.');
    }

    const newScan = await Scan.create({
      projectId,
      domain,
      state: 'none', // Default state
    });

    if (!newScan) {
      throw new ApiError(constants.BAD_REQUEST, "Errore nella creazione dell'oggetto");
    }

    sendResponse(res, {
      statusCode: constants.RESOURCE_CREATED,
      success: true,
      message: 'Projetto creato con successo.',
      data: {
        id: newScan.id,
        projectId: newScan.projectId,
        domain: newScan.domain,
        ip_domain: newScan.ip_domain,
        state: newScan.state,
        startTime: newScan.startTime,
        endTime: newScan.endTime,
        reportPath: newScan.reportPath,
        scanResults: newScan.scanResults,
      },
    });
  } catch (err) {
    next(err);
  }
};
