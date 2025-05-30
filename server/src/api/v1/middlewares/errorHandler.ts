// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { sendResponse, constants } from '../utils/';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || constants.SERVER_ERROR;
  sendResponse(res, {
    statusCode: status,
    success: false,
    message: err.message || 'Errore interno del server',
  });
};
