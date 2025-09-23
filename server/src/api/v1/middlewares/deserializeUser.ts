import { NextFunction, Response } from 'express';
import { refreshSession } from '../controllers/SessionController';
import { verifyJWT } from '../utils/jwt.utils';
import { ApiError, constants } from '../utils';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { AccessTokenPayload, RefreshTokenPayload } from '../types/jwt';
import { getUser } from '../services/user.service';

/**
 * @description Middleware to deserialize user from cookies.
 * It checks for an access token and verifies its validity.
 */
const deserializeUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let { accessToken, refreshToken } = req.cookies;
  // Se ho un access token, verifico la sua validità
  if (accessToken) {
    const { payload, expired } = verifyJWT<AccessTokenPayload>(accessToken);
    if (!expired && payload) {
      req.user = payload;
      return next();
    }
  }
  // Se abbiamo il refresh token, proviamo a rigenerare l'access token
  if (refreshToken && !accessToken) {
    const { payload: refreshPayload } = verifyJWT<RefreshTokenPayload>(refreshToken);
    if (!refreshPayload) {
      throw new ApiError(constants.UNAUTHORIZED, 'Accesso negato: Devi prima registrarti');
    }

    const retUser = await getUser(refreshPayload.userId);

    accessToken = await refreshSession(retUser.id, req, res);

    req.user = retUser;
  }
  // Se non abbiamo accessToken e refreshToken, non inserisco l'utente nel req.user
  return next();
};

export default deserializeUser;
