import dotenv from 'dotenv';

dotenv.config();

interface Config {
  SERVER_PORT: number;
  CLIENT_PORT: number;
  JWT_KEY: string;
  PSW_SALT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PSW: string;
  DB_HOST: string;
  DB_PORT: number;
}

const config: Config = {
  SERVER_PORT: Number(process.env.SERVER_PORT) || 3000,
  CLIENT_PORT: Number(process.env.CLIENT_PORT) || 3000,
  JWT_KEY: String(process.env.JWT_KEY),
  PSW_SALT: Number(process.env.PSW_SALT),
  DB_NAME: String(process.env.DB_NAME),
  DB_USER: String(process.env.DB_USER),
  DB_PSW: String(process.env.DB_PASSWORD),
  DB_HOST: String(process.env.DB_HOST),
  DB_PORT: Number(process.env.DB_PORT),
};

export default config;
