import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { ApiError, constants, sendResponse } from '../utils';
import axios from 'axios';
import config from '@config/config';
import { ApiResponse, ScanResponse } from '../types/server_api_response';
import { Scan } from '../models/ScanModel';
import { ScanResult } from '../models/ScanResultModel';

/**
 * @description start a new Scan for a Target
 * @route POST /scan/start
 * @access private
 */
export const createScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let newScan: Scan | null = null; // variabile disponibile a tutta la funzione
  try {
    let { url, targetId } = req.body;
    if (!url || !targetId) {
      throw new ApiError(constants.BAD_REQUEST, 'Url or targetId not found.');
    }
    console.log('Starting scan for url:', url, 'and targetId:', targetId);
    // 1. Inserisco record nel DB
    newScan = await Scan.create({
      targetId: targetId,
      url,
      status: 'pending', // così in futuro posso gestire code di scansioni
    });

    if (!newScan) {
      throw new ApiError(constants.BAD_REQUEST, "Errore nella creazione dell'oggetto");
    }
    const scanId = newScan.id;

    // 2. Chiamo Flask passando l'idScan
    const apiRes = await axios.post<ApiResponse<ScanResponse>>(
      `${config.API_BASE_URL}/start-scan`,
      {
        url,
        scanId: scanId,
      }
    );

    if (apiRes.data.success) {
      sendResponse(res, {
        statusCode: constants.RESOURCE_CREATED,
        success: true,
        message: 'Scan started successfully.',
        data: {
          idScan: scanId,
          status: newScan.state,
        },
      });
    }
  } catch (err) {
    // Se il record è stato creato, allora lo metto failed
    if (newScan) {
      await Scan.update({ state: 'failed' }, { where: { id: newScan.id } });
    }
    next(err);
  }
};

/**
 * @description Get the status of a Scan
 * @route GET /scan/:scanId/status
 * @access private
 */
export const getStatusScan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { scanId } = req.params;
    if (!scanId) {
      throw new ApiError(constants.BAD_REQUEST, 'ScanId not found.');
    }

    const scan = await Scan.findByPk(scanId);
    if (!scan) {
      throw new ApiError(constants.BAD_REQUEST, 'Scan not found.');
    }
    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: '',
      data: {
        idScan: scan.id,
        status: scan.state,
      },
    });
  } catch (err) {
    next(err);
  }
};
