export interface ScanResponse {
  state: 'pending' | 'running' | 'done' | 'failed';
  startTime?: Date;
  reportPath?: string;
}
