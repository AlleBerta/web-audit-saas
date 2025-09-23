import { Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  email: string;
  name: string;
  surname: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'> {}
