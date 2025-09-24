import { Sequelize } from 'sequelize-typescript';
import config from './config';
import { User } from '@api/v1/models/UserModel';
import { Project } from '@api/v1/models/ProjectModel';
import { Scan } from '@api/v1/models/ScanModel';
import { ScanResult } from '@api/v1/models/ScanResultModel';
import { Session } from '@api/v1/models/SessionModel';
import { Target } from '@api/v1/models/TargetModel';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PSW,
  database: config.DB_NAME,
  models: [User, Session, Project, Target, Scan, ScanResult],
  logging: true,
});
