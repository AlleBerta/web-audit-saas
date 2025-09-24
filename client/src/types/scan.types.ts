import { ScanResult } from './scanResult.types';

export interface LastScan {
  id: number;
  state: 'pending' | 'running' | 'done' | 'failed' | 'none' | 'canceled';
  startTime?: string;
  endTime?: string;
  reportPath?: string; // Per la Dashboard non serve
  scanResults?: ScanResult[];
}
