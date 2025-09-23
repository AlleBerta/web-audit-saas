import { Response, CookieOptions } from 'express';

interface CookieSpec {
  name: string;
  value: string;
  options?: CookieOptions;
}
interface SendResponseOptions<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  cookies?: CookieSpec[];
}

/**
 * @description Invia una risposta HTTP standardizzata al client, impostando eventuali cookie prima di inviare il JSON.
 *
 * @param res - L'oggetto Response di Express.
 * @param options - Oggetto contenente statusCode, success, message e opzionalmente data.
 * @returns La risposta Express inviata al client.
 */
export function sendResponse<T = any>(
  res: Response,
  { statusCode, success, message, data, cookies }: SendResponseOptions<T>
): Response {
  // 1. Imposta tutti i cookie specificati
  if (cookies) {
    for (const { name, value, options } of cookies) {
      if (options) {
        res.cookie(name, value, options);
      } else {
        res.cookie(name, value);
      }
    }
  }

  // 2. Costruisci l'oggetto risposta
  const responseObject: {
    success: boolean;
    message: string;
    data?: T;
  } = { success, message };

  if (data !== undefined) {
    responseObject.data = data;
  }

  // 3. Manda lo status e il JSON
  return res.status(statusCode).json(responseObject);
}
