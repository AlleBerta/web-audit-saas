// src/models/index.ts
import { sequelize } from '@config/database';
import { User } from './UserModel';
import { Project } from './ProjectModel';
import { Scan } from './ScanModel';
import { ScanResult } from './ScanResultModel';

// Se non usi il pattern `models: [ ... ]` in database.ts,
// puoi anche registrare manualmente:
// sequelize.addModels([User, Project]);

export const db = {
  sequelize,
  User,
  Project,
  Scan,
  ScanResult,
};
