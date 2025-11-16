import { Response, NextFunction } from 'express';
import { sendResponse, ApiError, constants } from '../utils/';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { col, fn } from 'sequelize';
import { Project } from '../models/ProjectModel';
import { Scan } from '../models/ScanModel';
import { ScanResult } from '../models/ScanResultModel';
import { Target } from '../models/TargetModel';

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
 * @note return only id, name, count of target
 */
export const getProjectsTab = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const projects = await Project.findAll({
      where: { userId },
      include: [
        {
          model: Target,
          attributes: [], // evita che Sequelize selezioni tutte le colonne di Scan
        },
      ],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt'],
        include: [[fn('COUNT', fn('DISTINCT', col('targets.domain'))), 'count']],
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

    // mostra tutti i risultati dell'ultima scansione per ogni target
    const project = await Project.findByPk(projectId, {
      attributes: ['id', 'name', 'userId'],
      include: [
        {
          model: Target,
          as: 'targets',
          attributes: ['id', 'projectId', 'domain', 'ip_domain'],
          include: [
            {
              model: Scan,
              as: 'scans',
              separate: true, // necessario per far funzionare limit
              limit: 1, // solo l’ultimo
              order: [['id', 'DESC']], // per definire “ultimo”
              attributes: ['id', 'state', 'start_time', 'end_time'],
              include: [
                {
                  model: ScanResult,
                  as: 'scanResults',
                  attributes: ['id', 'scanId', 'vulnerabilityType', 'severity', 'description'],
                  order: [['id', 'DESC']],
                  separate: true,
                },
              ],
            },
          ],
        },
      ],
      order: [
        ['id', 'ASC'], // project.id asc
        [{ model: Target, as: 'targets' }, 'id', 'ASC'], // target.id asc
      ],
    });

    console.log('single project');
    console.log(project);
    return sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Progetto trovato con successo.',
      data: project,
    });
  } catch (err) {
    console.log('errorrr!!! ', err);
    next(err);
  }
};
