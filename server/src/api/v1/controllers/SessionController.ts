import { Request, Response, NextFunction } from 'express';
import { sendResponse, ApiError, constants } from '../utils/';
import { Session } from '../models/SessionModel';
import { signJWT } from '../utils/jwt.utils';
import { User } from '../models/UserModel';
import { add } from 'date-fns';

/**
 * @description Get the session
 */
export function getSession(req: Request, res: Response) {
  // @ts-ignore
  if (!req.user) {
    return sendResponse(res, {
      statusCode: constants.UNAUTHORIZED,
      success: false,
      message: 'Utente non autenticato.',
    });
  }

  return sendResponse(res, {
    statusCode: constants.OK,
    success: true,
    message: 'Utente autenticato con successo.',
    //@ts-ignore
    data: req.user,
  });
}

/**
 * @description Restituisce se la sessione è expired o meno
 */
export const getValidSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new ApiError(constants.BAD_REQUEST, 'refresh Token non ricevuto.');

    const session = await Session.findOne({ where: { refreshToken } });
    if (!session || session.revoked || session.expiresAt < new Date()) {
      throw new ApiError(constants.BAD_REQUEST, 'Token non valido.');
    }

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Verifica validità della session',
      data: { expiresAt: session.expiresAt },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Invalido il token
 */
export const invalidateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken, expiresAt } = req.body;

    if (!refreshToken || !expiresAt)
      throw new ApiError(constants.BAD_REQUEST, 'refresh Token non ricevuto.');

    const session = await Session.findOne({ where: { refreshToken } });
    if (!session) throw new ApiError(constants.BAD_REQUEST, 'Token non valido.');

    // invalido l'access token
    const [updateSession] = await Session.update(
      {
        expiresAt: new Date(0),
      },
      {
        where: { refreshToken: refreshToken },
      }
    );
    if (updateSession === 0) {
      throw new ApiError(constants.NOT_FOUND, 'Token non trovato o nessuna modifica necessaria');
    }

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Token invalidato con successo',
      data: { expiresAt: session.expiresAt },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Creo la sessione dell'utente
 */
export const createSessionHandler = async (req: Request, res: Response) => {
  const { id } = req.body;

  const existingUser = await User.findByPk(id);
  if (!existingUser) {
    throw new ApiError(constants.CONFLICT, 'Utente non esistente.');
  }

  // calcolo scadenza: ad esempio 1 anno da ora
  const expiresAt = add(new Date(), { years: 1 });

  // crea refresh token
  const sessionDb = await Session.create({
    refreshToken: '', // lo aggiornerai dopo la firma
    revoked: false,
    expiresAt,
    userId: existingUser.id,
  });

  // genera i token
  const accessToken = signJWT(
    {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      surname: existingUser.surname,
      role: existingUser.role,
    },
    '1h'
  );

  const refreshToken = signJWT({ sessionId: sessionDb.id }, '1y');

  // aggiorna il token nel db (opzionale ma utile per verificarlo in futuro)
  await sessionDb.update({ refreshToken });

  // invia i cookie
  res.cookie('accessToken', accessToken, {
    maxAge: 60 * 60 * 1000, // 1h
    httpOnly: true,
  });

  res.cookie('refreshToken', refreshToken, {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1y
    httpOnly: true,
  });

  // restituisci utente loggato (o anche solo true se preferisci)
  return res.send({
    success: true,
    user: {
      id: existingUser.id,
      name: existingUser.name,
      surname: existingUser.surname,
      email: existingUser.email,
      role: existingUser.role,
      sessionId: sessionDb.id, // utile per revoche o debug
    },
  });
};

/**
 * @description Delete session
 */
export function deleteSessionHandler(req: Request, res: Response) {
  res.cookie('accessToken', '', {
    maxAge: 0,
    httpOnly: true,
  });

  res.cookie('refreshToken', '', {
    maxAge: 0,
    httpOnly: true,
  });

  // @ts-ignore
  const session = invalidateSession(req.user.sessionId);

  return res.send(session);
}
