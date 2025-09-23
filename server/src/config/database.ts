import { Sequelize } from 'sequelize-typescript';
import config from './config';
import { User } from '@api/v1/models/UserModel';
import { Project } from '@api/v1/models/ProjectModel';
import { Scan } from '@api/v1/models/ScanModel';
import { ScanResult } from '@api/v1/models/ScanResultModel';
import { Session } from '@api/v1/models/SessionModel';

export const sequelize = new Sequelize({
  database: config.DB_NAME,
  username: config.DB_USER,
  password: config.DB_PSW,
  host: config.DB_HOST,
  port: config.DB_PORT,
  dialect: 'mysql',
  logging: true,
  models: [User, Project, Scan, ScanResult, Session],
  /** questo funizona solo in js, non in ts
   * models: [__dirname, '@api/v1/models'], // carica automaticamente tutti i model .ts o .js
   */
});
