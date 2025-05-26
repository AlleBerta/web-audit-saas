// src/models/index.ts
import { sequelize } from '@config/database';
import { User } from './User';
import { Project } from './Project';
import { Scan } from './Scan';
import { ScanResult } from './ScanResult';

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
