export interface ScanAttributes {
  id: number;
  projectId: number;
  state: 'pending' | 'running' | 'done' | 'failed';
  startTime?: Date;
  endTime?: Date;
  reportPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScanCreationAttributes
  extends Omit<ScanAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
