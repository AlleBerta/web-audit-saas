import { LastScan } from '@/types/scan.types';
import { TargetStatus } from '@/types/target.types';

/**
 * @description Convert DB Result state from UI View
 * States from db: 'pending' | 'running' | 'done' | 'failed' | 'none' | 'canceled';
 * States from UI: 'In Progress' | 'Error' | 'Finished';
 */
export function mapDbStateToTargetStatus(state: LastScan['state']): TargetStatus {
  if (state === 'pending' || state === 'running') return 'In Progress';
  if (state === 'failed' || state === 'canceled') return 'Error';
  return 'Finished'; // done o none
}
