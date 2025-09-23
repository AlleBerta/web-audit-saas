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

  // aggiorna il token nel db
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
 * @description Refresh access Token
 */
export async function refreshSession(userId: number, req: Request, res: Response) {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });

  if (!user) throw new ApiError(constants.BAD_REQUEST, 'Utente non trovato');

  // generero il nuovo accessToken
  const accessToken = generateAccessCookie(user, res);
  return { accessToken };
}

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
 * @description Logout User
 * @route PUT /user/logout
 * @access private
 */
export const deleteSessionHandler = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    throw new ApiError(constants.UNAUTHORIZED, 'Utente non autenticato.');
  }

  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new ApiError(constants.BAD_REQUEST, 'refresh Token non ricevuto.');
    }

    const session = await Session.findOne({ where: { refreshToken } });
    if (!session) {
      throw new ApiError(constants.BAD_REQUEST, 'Token non valido.');
    }

    // Elimino il refreshtoken dal db
    const [updatedCount] = await Session.update(
      { expiresAt: new Date(0) },
      { where: { refreshToken } }
    );

    if (updatedCount === 0) {
      throw new ApiError(constants.NOT_FOUND, 'Token non trovato o già invalidato.');
    }

    // Rimuovo i cookie solo alla fine
    res.cookie('accessToken', '', { maxAge: 0, httpOnly: true });
    res.cookie('refreshToken', '', { maxAge: 0, httpOnly: true });

    return sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Logout effettuato con successo.',
      data: { expiresAt: session.expiresAt },
    });
  } catch (err) {
    throw new ApiError(constants.SERVER_ERROR, 'Errore interno del server.');
  }
};
