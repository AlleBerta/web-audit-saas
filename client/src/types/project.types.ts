import { string } from 'yup';
import { TargetResponse } from './target.types';

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
  scans?: TargetResponse[];
}
