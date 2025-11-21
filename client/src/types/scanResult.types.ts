export interface ScanResult {
  id: number;
  scanId: number;
  vulnerabilityType: string;
  severity: string;
  description: string;
  urlAffected?: string; // Per la Dashboard non serve
}

export interface CVEEntry {
  id: number;
  scanId: number;
  vulnerabilityType: string; // es: "CVE-2023-1234"
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}
