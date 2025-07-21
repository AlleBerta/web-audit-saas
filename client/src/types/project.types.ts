import { string } from 'yup';
import { ScanResponse } from './scan.types';

export interface ProjectFormData {
  name: string;
  domain: string;
}

export interface ProjectResponse {
  id: number;
  userId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  scans?: ScanResponse[];
}
