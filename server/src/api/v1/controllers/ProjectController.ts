import { Response, NextFunction } from 'express';
import { sendResponse, ApiError, constants } from '../utils/';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { Project } from '../models/ProjectModel';
import { Scan } from '../models/ScanModel';
import { ScanResult } from '../models/ScanResultModel';
import { col, fn } from 'sequelize';

/**
 * @description Create one Project from user
 * @route POST /project/
 * @access private
 */
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
 * @route GET /project/tab
 * @access private
 * @note return only id, name, count of scan
 */
export const getProjectsTab = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
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
      include: [
        {
          model: Scan,
          attributes: [], // evita che Sequelize selezioni tutte le colonne di Scan
        },
      ],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt'],
        include: [[fn('COUNT', fn('DISTINCT', col('scans.domain'))), 'count']],
      },
      group: ['Project.id'],
    });

    console.log('projectTab');
    console.log(projects);
    return sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Progetti trovati con successo.',
      data: projects,
    });
  } catch (err) {
    console.log('errorrr!!! ', err);
    next(err);
  }
};

/**
 * @description Get All info from one single user Project
 * @route GET /project/:id
 * @access private
 */
export const getProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    console.log('-----------------------------------------------------------');
    // console.log(req);
    const userId = req.user?.id;
    const projectId = req.params.id;
    console.log('userId: ' + userId);
    if (!userId) {
      return sendResponse(res, {
        statusCode: constants.UNAUTHORIZED,
        success: false,
        message: 'Utente non autenticato.',
      });
    }
    const projects = await Project.findByPk(projectId, {
      include: [
        {
          model: Scan,
          include: [ScanResult], // <--- include annidato
        },
      ],
    });

    console.log('single project');
    console.log(projects);
    return sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Progetto trovato con successo.',
      data: projects,
    });
  } catch (err) {
    console.log('errorrr!!! ', err);
    next(err);
  }
};
