import { Router } from 'express';
import { RequestHandler } from 'express';
import { createScan, getStatusScan } from '../controllers/ScanController';
import { getCompletedScan } from '../controllers/ScanResultController';

const router = Router();

router.post('/start', createScan as unknown as RequestHandler);
router.get('/:scanId/status', getStatusScan as unknown as RequestHandler);
router.get('/:scanId/completed', getCompletedScan as unknown as RequestHandler);

export default router;
