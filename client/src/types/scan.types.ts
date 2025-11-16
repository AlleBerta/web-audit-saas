import { ScanResult } from './scanResult.types';

export interface LastScan {
  id: number;
  state: 'pending' | 'running' | 'done' | 'failed' | 'none' | 'canceled';
  start_time?: string;
  end_time?: string;
  reportPath?: string; // Per la Dashboard non serve
  penstestPath?: string; // Per la Dashboard non serve
  scanResults?: ScanResult[];
}

export interface ScanResponse {
  idScan: number;
  status: 'pending' | 'processing' | 'done' | 'error'; // Rispecchia i valori possibili nel db
}
