import { Router } from 'express';
import { RequestHandler } from 'express';
import { getFullReport } from '../controllers/ScanResultController';

const router = Router();

router.get('/:scanId/full', getFullReport as unknown as RequestHandler);

export default router;
