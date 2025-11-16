export interface ScanResult {
  id: number;
  scanId: number;
  vulnerabilityType: string;
  severity: string;
  description: string;
  urlAffected?: string; // Per la Dashboard non serve
}
