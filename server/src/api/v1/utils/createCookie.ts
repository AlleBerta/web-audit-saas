import { Response } from 'express';
import { User } from '../models/UserModel';
import { signJWT, constants } from './index';
import { ApiError } from './error';

export function generateAccessCookie(user: User, res: Response) {
  console.log(
    '---------------------------------------------------------\nEntro quaaaa\n---------------------------------------------------------'
  );
  try {
    const accessToken = signJWT(
      {
        id: user.dataValues.id,
        email: user.dataValues.email,
        name: user.dataValues.name,
        surname: user.dataValues.surname,
        role: user.dataValues.role,
      },
      '5m'
    );
    console.log(accessToken);
    res.cookie('accessToken', accessToken, {
      maxAge: 5 * 60 * 1000, // 5m
      httpOnly: true,
    });

    return accessToken;
  } catch (err) {
    console.log(err);
    throw new ApiError(constants.SERVER_ERROR, 'errore interno');
  }
}

export function generateRefreshToken(sessionId: number, userId: number, res: Response) {
  const refreshToken = signJWT({ sessionId: sessionId, userId: userId }, '1y');

  res.cookie('refreshToken', refreshToken, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  return refreshToken;
}
