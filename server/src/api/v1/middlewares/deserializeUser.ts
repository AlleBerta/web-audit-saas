import { NextFunction, Response } from 'express';
import { refreshSession } from '../controllers/SessionController';
import { verifyJWT } from '../utils/jwt.utils';
import { ApiError, constants } from '../utils';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { getUser } from '../controllers/UserController';

/**
 * @
 */
const deserializeUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let { accessToken, refreshToken } = req.cookies;

  if (accessToken) {
    const { payload, expired } = verifyJWT(accessToken || '');
    if (!expired) {
      //@ts-ignore
      req.user = payload;
      return next();
    }
  }
  // Se abbiamo il refresh token, proviamo a rigenerare l'access token
  if (refreshToken && !accessToken) {
    const { payload: refreshPayload } = verifyJWT(refreshToken);
    if (!refreshPayload) {
      throw new ApiError(constants.UNAUTHORIZED, 'Accesso negato: Devi prima registrarti');
    }

    //@ts-ignore
    const { retUser } = await getUser(refreshPayload.userId);
    //@ts-ignore
    accessToken = await refreshSession(retUser.id, req, res);

    req.user = retUser;
  }

  return next();
};

// function deserializeUser(req: Request, res: Response, next: NextFunction) {
//   const { accessToken, refreshToken } = req.cookies;
//   console.log('cookie');
//   console.log(req.cookies);

//   // Se l'utente non ha l'access token continua come non loggato
//   if (!accessToken) {
//     return next();
//   }

//   // Verifico la validità dell'access token
//   const { payload, expired } = verifyJWT(accessToken);

//   console.log('payload: ' + payload);
//   console.log('expired: ' + expired);
//   // Se è valido, inserisco l'utente e passo al prossimo middleware
//   if (payload) {
//     // @ts-ignore
//     req.user = payload;
//     return next();
//   }

//   // Se l'access token è scaduto, prova a verificare il refresh token
//   const { payload: refresh } =
//     expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

//   if (!refresh) {
//     return next();
//   }

//   // Se il refresh non è valido,
//   // @ts-ignore
//   const session = getSession(refresh.sessionId);

//   if (!session) {
//     return next();
//   }

//   // Creo un nuovo access token
//   const newAccessToken = signJWT(session, '1h');

//   res.cookie('accessToken', newAccessToken, {
//     maxAge: 60 * 60 * 1000, // 1h
//     httpOnly: true,
//   });

//   // @ts-ignore
//   req.user = verifyJWT(newAccessToken).payload;

//   return next();
// }

export default deserializeUser;
