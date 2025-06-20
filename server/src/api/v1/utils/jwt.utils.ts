import { sign, verify, SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { Response } from 'express';
import config from '@config/config';
import { User } from '../models/UserModel';
import { Session } from '../models/SessionModel';
import { add } from 'date-fns';

// sign jwt
export function signJWT(payload: object, expiresIn?: StringValue | number) {
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn, // questa è corretta ora
  };

  if (!config.JWT_PRIVATE_KEY) {
    throw new Error('JWT_PRIVATE_KEY is not defined');
  }

  return sign(payload, config.JWT_PRIVATE_KEY, options);
}

// verify jwt
export function verifyJWT(token: string) {
  try {
    const decoded = verify(token, config.JWT_PUBLIC_KEY);
    return { payload: decoded, expired: false };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return { payload: null, expired: true };
    }
    return { payload: null, expired: false };
  }
}

// Create tokens and store refresh token into database
export async function generateSessionTokens(user: User, res: Response) {
  const expiresAt = add(new Date(), { years: 1 });

  const session = await Session.create({
    refreshToken: '',
    revoked: false,
    expiresAt,
    userId: user.id,
  });

  const accessToken = signJWT(
    { id: user.id, email: user.email, name: user.name, surname: user.surname, role: user.role },
    '5m'
  );
  const refreshToken = signJWT({ sessionId: session.id }, '1y');
  console.log('inizio refresToken');
  console.log(refreshToken);
  console.log('fine refresToken + lenght: ' + refreshToken.length);

  await Session.update({ refreshToken }, { where: { id: session.id } });

  res.cookie('accessToken', accessToken, {
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
  });

  res.cookie('refreshToken', refreshToken, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  return {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
  };
}

// Take session from db and check if is valid or not

// Invalido la sessione
