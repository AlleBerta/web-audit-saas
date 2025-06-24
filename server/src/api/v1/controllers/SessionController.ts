import { Request, Response, NextFunction } from 'express';
import {
  sendResponse,
  ApiError,
  constants,
  generateAccessCookie,
  generateRefreshToken,
} from '../utils/';
import { Session } from '../models/SessionModel';
import { User } from '../models/UserModel';
import { add } from 'date-fns';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

/**
 * @description Get the session
 */
export function getSession(req: AuthenticatedRequest, res: Response) {
  console.log('user: ');
  console.log(req.cookies);
  const { accessToken, sessionToken } = req.cookies;

  if (!accessToken && sessionToken) {
  } else if (!accessToken) {
    return sendResponse(res, {
      statusCode: constants.UNAUTHORIZED,
      success: false,
      message: 'Utente non autenticato.',
    });
  }

  return sendResponse(res, {
    statusCode: constants.OK,
    success: true,
    message: 'Utente autenticato.',
    //@ts-ignore
    data: req.user,
  });
}

/**
 * @description Restituisce se la sessione è expired o meno
 */
export const getValidSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) throw new ApiError(constants.BAD_REQUEST, 'refresh Token non ricevuto.');

    const session = await Session.findOne({ where: { id: sessionId, revoked: false } });
    if (!session || session.revoked || session.expiresAt < new Date()) {
      throw new ApiError(constants.BAD_REQUEST, 'Token non valido.');
    }

    // Ricavo le info dell'utente e rigenero l'accessToken
    const user = await User.findByPk(session.userId);
    if (!user) {
      throw new ApiError(constants.UNAUTHORIZED, 'Utente associato al token non riconosciuto');
    }

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Verifica validità del refresh token',
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
export const createSession = async (user: User, res: Response) => {
  // calcolo scadenza: ad esempio 1 anno da ora
  const expiresAt = add(new Date(), { years: 1 });

  // crea refresh token
  const sessionDb = await Session.create({
    refreshToken: '', // lo aggiornerai dopo la firma
    revoked: false,
    expiresAt,
    userId: user.id,
  });

  // genera i token
  const accessToken = generateAccessCookie(user, res);
  const refreshToken = generateRefreshToken(sessionDb.id, user.id, res);

  // aggiorna il token nel db (opzionale ma utile per verificarlo in futuro)
  await sessionDb.update({ refreshToken });

  // restituisci utente loggato
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
    role: user.role,
  };
};

/**
 * @description Delete session
 */
export const deleteSessionHandler = async (req: Request, res: Response) => {
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

  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) throw new ApiError(constants.BAD_REQUEST, 'refresh Token non ricevuto.');

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
      message: 'Token eliminato con successo',
      data: { expiresAt: session.expiresAt },
    });
  } catch (err) {
    throw new ApiError(constants.SERVER_ERROR, 'errore interno del server');
  }

  return res.send(session);
};

/**
 * @description Create tokens and store refresh token into database
 */
export async function sessionTokenHandler(user: User, req: Request, res: Response) {
  /**
   * Devo distinguere 4 casi:
   * 1. accessToken: valido     | refreshToken: valido     -> qui non ci entra
   * 2. accessToken: non valido | refreshToken: valido     -> creo solo accessToken
   * 3. accessToken: valido     | refreshToken: non valido -> logout immediato, deve loggarsi di nuovo
   * 4. accessToken: non valido | refreshToken: non valido -> logout immediato, deve loggarsi di nuovo
   */
  let { accessToken, refreshToken } = req.cookies;
  console.log('pronto?');
  console.log(accessToken);
  console.log(refreshToken);
  console.log('che cosa hai visto?');
  // Caso 1
  if (accessToken && refreshToken) {
    return sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Utente autenticato.',
      //@ts-ignore
      data: req.user,
    });
  }
  // caso 2
  if (!accessToken && refreshToken) {
    // Pulisco il campo password prima di passarlo
    user.dataValues.password = '';
    accessToken = generateAccessCookie(user, res);
  }
  // caso 3
  if (accessToken && !refreshToken) {
    await deleteSessionHandler(req, res);
  }
  // caso 4
  if (!accessToken && !refreshToken) {
    const expiresAt = add(new Date(), { years: 1 });

    const session = await Session.create({
      refreshToken: '',
      revoked: false,
      expiresAt,
      userId: user.id,
    });

    // Pulisco il campo password prima di passarlo
    user.dataValues.password = '';
    accessToken = generateAccessCookie(user, res);
    refreshToken = generateRefreshToken(session.id, user.id, res);

    await Session.update({ refreshToken }, { where: { id: session.id } });
  }

  return sendResponse(res, {
    statusCode: constants.OK,
    success: true,
    message: 'Utente autenticato.',
    //@ts-ignore
    data: req.user,
  });
}

/**
 * @description Refresh access Token
 */
export async function refreshSession(userId: number, req: Request, res: Response) {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });

  if (!user) throw new ApiError(constants.BAD_REQUEST, 'Utente non trovato');

  // generero il nuovo accessToken
  const accessToken = generateAccessCookie(user, res);
  return { accessToken };
}
