export interface ScanAttributes {
  id: number;
  projectId: number;
  domain: string;
  ip_domain?: string;
  state: 'pending' | 'running' | 'done' | 'failed' | 'canceled' | 'none';
  startTime?: Date;
  endTime?: Date;
  reportPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScanCreationAttributes
  extends Omit<ScanAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
