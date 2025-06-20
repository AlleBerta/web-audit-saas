import { NextFunction, Request, Response } from 'express';
import { getSession } from '../controllers/SessionController';
import { signJWT, verifyJWT } from '../utils/jwt.utils';

/**
 * @
 */
function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  // Se l'utente non ha l'access token prosegue senza essere autenticato
  if (!accessToken) {
    return next();
  }

  // Verifico la validità dell'access token
  const { payload, expired } = verifyJWT(accessToken);

  // Se è valido, inserisco l'utente e passo al prossimo middleware
  if (payload) {
    // @ts-ignore
    req.user = payload;
    return next();
  }

  // Se l'access token è scaduto, prova a verificare il refresh token
  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  if (!refresh) {
    return next();
  }

  // Se il refresh non è valido,
  // @ts-ignore
  const session = getSession(refresh.sessionId);

  if (!session) {
    return next();
  }

  // Creo un nuovo access token
  const newAccessToken = signJWT(session, '1h');

  res.cookie('accessToken', newAccessToken, {
    maxAge: 60 * 60 * 1000, // 1h
    httpOnly: true,
  });

  // @ts-ignore
  req.user = verifyJWT(newAccessToken).payload;

  return next();
}

export default deserializeUser;
