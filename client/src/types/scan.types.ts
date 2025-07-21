import { ScanResult } from './scanResult.types';

export interface ScanResponse {
  id: number;
  projectId: number;
  domain: string;
  ip_domain: string;
  state: 'pending' | 'running' | 'done' | 'failed';
  startTime?: Date;
  endTime?: Date;
  reportPath?: string;
  scanResults?: ScanResult[];
}
