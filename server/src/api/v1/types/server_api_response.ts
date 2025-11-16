export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ScanResponse {
  idScan: number;
  status: 'pending' | 'processing' | 'running' | 'done' | 'error'; // Rispecchia i valori possibili nel db
}

export interface ScanStatus {
  idScan: number;
  status: 'pending' | 'processing' | 'running' | 'done' | 'error';
  timestampEnd: string;
  timestampStart: string;
  url: string;
}

export interface ScanResult {
  id: number;
  scanId: number;
  vulnerabilityType: string;
  severity: string;
  description: string;
  urlAffected?: string; // Per la Dashboard non serve
}
