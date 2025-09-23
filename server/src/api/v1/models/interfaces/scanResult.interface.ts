export interface ScanResultAttributes {
  id: number;
  scanId: number;
  vulnerabilityType: string;
  severity: string;
  description?: string;
  urlAffected?: string;
  createdAt: Date;
}

export interface ScanResultCreationAttributes
  extends Omit<ScanResultAttributes, 'id' | 'createdAt'> {}
