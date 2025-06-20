import { Request, Response, NextFunction } from 'express';
import { sendResponse, ApiError, constants } from '../utils/';
import { Project } from '../models/ProjectModel';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { domain, name } = req.body;
    //@ts-ignore
    const { userId } = req.user.id;
    if (!domain || !name) {
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
