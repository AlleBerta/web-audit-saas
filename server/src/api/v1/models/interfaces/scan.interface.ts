export interface ScanAttributes {
  id: number;
  targetId: number;
  state: ScanState;
  startTime?: Date;
  endTime?: Date;
  reportPath?: string;
  pentestPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ScanState {
  state: 'pending' | 'running' | 'done' | 'failed' | 'canceled' | 'none';
}

export interface ScanCreationAttributes
  extends Omit<ScanAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
