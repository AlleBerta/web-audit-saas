import { Optional } from 'sequelize';

export interface SessionAttributes {
  id: number;
  refreshToken: string;
  revoked: boolean;
  expiresAt: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionCreationAttributes
  extends Optional<SessionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
