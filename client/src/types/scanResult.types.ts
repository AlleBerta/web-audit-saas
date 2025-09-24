export interface ScanResult {
  id: number;
  scanId: number;
  vulnerabilityType: string;
  severity: string;
  description: string;
  urlAffected?: string; // Per la Dashboard non serve
}

export interface ScanResponse {
  idScan: number;
  status: 'pending' | 'processing' | 'done' | 'error'; // Rispecchia i valori possibili nel db
}

export interface ScanStatus {
  idScan: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  timestampEnd: string;
  timestampStart: string;
  url: string;
}
