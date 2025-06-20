import { NextFunction, Request, Response } from 'express';
import { constants, sendResponse } from '../utils';

/**
 * @description Check if User is logged in or not
 */
export function requireUser(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (!req.user) {
    return sendResponse(res, {
      statusCode: constants.FORBIDDEN,
      success: false,
      message: 'Invalid session',
    });
  }

  return next();
}
