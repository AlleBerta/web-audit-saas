import { Response } from 'express';

interface SendResponseOptions<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Invia una risposta HTTP standardizzata al client.
 *
 * @param res - L'oggetto Response di Express.
 * @param options - Oggetto contenente statusCode, success, message e opzionalmente data.
 * @returns La risposta Express inviata al client.
 */
export function sendResponse<T = any>(
  res: Response,
  { statusCode, success, message, data }: SendResponseOptions<T>
): Response {
  const responseObject: {
    success: boolean;
    message: string;
    data?: T;
  } = {
    success,
    message,
  };

  if (data !== undefined) {
    responseObject.data = data;
  }

  return res.status(statusCode).json(responseObject);
}
