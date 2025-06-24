import { sign, verify, SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { StringValue } from 'ms';
import config from '@config/config';

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
