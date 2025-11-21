import { Response, NextFunction } from 'express';
import { sendResponse, ApiError, constants } from '../utils';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
// import { Scan } from '../models/ScanModel';
import { Target } from '../models/TargetModel';
import { ScanResult } from '../models/ScanResultModel';
import { Scan } from '../models/ScanModel';
import { Op } from 'sequelize';

/**
 * @description Create one Project from user
 * @route POST /target/
 * @access private
 */
export const createTarget = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { domain, projectId } = req.body;
    domain = !domain || typeof domain !== 'string' ? '' : domain.trim();
    if (!projectId) {
      throw new ApiError(constants.BAD_REQUEST, 'Target associato ad un progetto non valido.');
    }

    const newScan = await Target.create({
      projectId,
      domain,
      ip_domain: '',
    });

    if (!newScan) {
      throw new ApiError(constants.BAD_REQUEST, "Errore nella creazione dell'oggetto");
    }

    sendResponse(res, {
      statusCode: constants.RESOURCE_CREATED,
      success: true,
      message: 'Target creato con successo.',
      data: {
        id: newScan.id,
        projectId: newScan.projectId,
        domain: newScan.domain,
        ip_domain: newScan.ip_domain,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Get domain name from target
 * @route GET /target/:id/domain
 * @access private
 */
export const getDomainTarget = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { targetId } = req.params;
    if (!targetId) {
      throw new ApiError(constants.BAD_REQUEST, 'Target not found.');
    }

    const domTarget = await Target.findByPk(targetId);

    if (!domTarget) {
      throw new ApiError(constants.BAD_REQUEST, 'Error during deleting target');
    }

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Target domain founded successfully.',
      data: { domain: domTarget?.domain },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Get all CVEs from all scans from a Target
 * @route GET /target/:scanId/cves
 * @access private
 */
export const getAllCVEsFromTarget = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { targetId } = req.params;
    if (!targetId) {
      throw new ApiError(constants.BAD_REQUEST, 'targetId not found.');
    }

    const allCVEs = await ScanResult.findAll({
      attributes: ['id', 'scanId', 'vulnerabilityType', 'severity', 'description'],
      include: [
        {
          model: Scan,
          attributes: [],
          where: {
            targetId: targetId,
            state: 'done',
          },
          required: true,
        },
      ],
      where: {
        vulnerabilityType: {
          [Op.like]: 'CVE-%',
        },
      },
      order: [['id', 'ASC']],
    });

    if (!allCVEs) {
      throw new ApiError(constants.BAD_REQUEST, 'Scan not found.');
    }

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'All CVEs from one target',
      data: allCVEs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Delete one Target from your Project
 * @route DELETE /target/:id
 * @access private
 */
export const deleteTarget = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { targetId } = req.params;
    if (!targetId) {
      throw new ApiError(constants.BAD_REQUEST, 'Target not found.');
    }

    const delScan = await Target.destroy({ where: { id: targetId } });

    if (!delScan) {
      throw new ApiError(constants.BAD_REQUEST, 'Error during deleting target');
    }

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Target eliminated successfully.',
    });
  } catch (err) {
    next(err);
  }
};
