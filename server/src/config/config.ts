import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

interface Config {
  SERVER_PORT: number;
  CLIENT_PORT: number;
  PSW_SALT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PSW: string;
  DB_HOST: string;
  DB_PORT: number;
  JWT_KEY: string;
  JWT_PUBLIC_KEY: string;
  JWT_PRIVATE_KEY: string;
}

const config: Config = {
  SERVER_PORT: Number(process.env.SERVER_PORT) || 3001,
  CLIENT_PORT: Number(process.env.CLIENT_PORT) || 4000,
  PSW_SALT: Number(process.env.PSW_SALT),
  DB_NAME: String(process.env.DB_NAME),
  DB_USER: String(process.env.DB_USER),
  DB_PSW: String(process.env.DB_PASSWORD),
  DB_HOST: String(process.env.DB_HOST),
  DB_PORT: Number(process.env.DB_PORT),
  JWT_KEY: String(process.env.JWT_KEY),
  JWT_PRIVATE_KEY: (() => {
    try {
      return fs.readFileSync(path.resolve(__dirname, '../keys/jwt.private.pem'), 'utf8');
    } catch (error) {
      throw new Error(
        'JWT private key file not found. Please ensure jwt.private.pem exists in the keys directory.'
      );
    }
  })(),
  JWT_PUBLIC_KEY: (() => {
    try {
      return fs.readFileSync(path.resolve(__dirname, '../keys/jwt.public.pem'), 'utf8');
    } catch (error) {
      throw new Error(
        'JWT public key file not found. Please ensure jwt.public.pem exists in the keys directory.'
      );
    }
  })(),
};

export default config;
