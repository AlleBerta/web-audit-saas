// src/models/index.ts
import { sequelize } from '@config/database';
import { User } from './UserModel';
import { Session } from './SessionModel';
import { Project } from './ProjectModel';
import { Target } from './TargetModel';
import { Scan } from './ScanModel';
import { ScanResult } from './ScanResultModel';

// Se non usi il pattern `models: [ ... ]` in database.ts,
// puoi anche registrare manualmente:
// sequelize.addModels([User, Project]);

export const db = {
  sequelize,
  User,
  Session,
  Project,
  Target,
  Scan,
  ScanResult,
};
