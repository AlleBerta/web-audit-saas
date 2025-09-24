import { Response, NextFunction } from 'express';
import { sendResponse, ApiError, constants } from '../utils';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
// import { Scan } from '../models/ScanModel';
import { Target } from '../models/TargetModel';

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

/**
 * @description Start scanning process on target
 * @route POST /scan/start
 * @access private
 */
// export const starScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   try {
//     let { domain, scanId } = req.body;

//     if (!domain || !scanId)
//       throw new ApiError(constants.BAD_REQUEST, 'Domain or ScanId are not present');

//     // const newScan = Scan.create({

//     // })
//   } catch (err) {
//     next(err);
//   }
// };

// async function startScan(url: string): Promise<number | null> {
//   try {
//     const res = await axios.post<ApiResponse<ScanResponse>>(`${API_BASE_URL}/start-scan`, {
//       url,
//     });
//     toast({
//       title: res.data.message,
//       description: 'La scansione durerà qualche minuto',
//     });
//     return res.data.data.idScan;
//   } catch (err: any) {
//     console.error("Errore durante l'avvio della scansione:", err);
//     toast({
//       title: err?.config?.message ?? 'Errore durante lo scanning',
//       description: err.response.data.message ?? 'Please, Retry',
//       variant: 'destructive',
//     });
//     return null;
//   }
// }
