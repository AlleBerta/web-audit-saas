import { NextFunction, Request, Response } from 'express';
import { constants, sendResponse } from '../utils';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

/**
 * @description Check if User is logged in or not
 */
export function requireUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return sendResponse(res, {
      statusCode: constants.FORBIDDEN,
      success: false,
      message: 'Invalid session',
    });
  }

  return next();
}
