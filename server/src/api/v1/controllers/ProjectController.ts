import { Response, NextFunction } from 'express';
import { sendResponse, ApiError, constants } from '../utils/';
import { Project } from '../models/ProjectModel';
import { Scan } from '../models/ScanModel';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, {
        statusCode: constants.UNAUTHORIZED,
        success: false,
        message: 'Utente non autenticato.',
      });
    }

    let { domain, name } = req.body;
    domain = !domain || typeof domain !== 'string' ? '' : domain.trim();
    if (!name) {
      throw new ApiError(constants.BAD_REQUEST, 'Tutti i campi sono obbligatori.');
    }

    const newProject = await Project.create({
      userId,
      domain,
      name,
    });

    if (!newProject) {
      throw new ApiError(constants.BAD_REQUEST, "Errore nella creazione dell'oggetto");
    }

    sendResponse(res, {
      statusCode: constants.RESOURCE_CREATED,
      success: true,
      message: 'Projetto creato con successo.',
      data: {
        userId: userId,
        domain: domain,
        name: name,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Get All Project from user
 * @route GET /project/
 * @access private
 */
export const getProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    console.log('-----------------------------------------------------------');
    // console.log(req);
    const userId = req.user?.id;
    console.log('userId: ' + userId);
    if (!userId) {
      return sendResponse(res, {
        statusCode: constants.UNAUTHORIZED,
        success: false,
        message: 'Utente non autenticato.',
      });
    }

    const projects = await Project.findAll({
      where: { userId },
      include: [Scan], // opzionale: se vuoi anche gli scan associati
    });

    return sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Progetti trovati con successo.',
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};
