import { Router } from 'express';
import { RequestHandler } from 'express';
import { createScan } from '../controllers/ScanController';

const router = Router();

router.post('/', createScan as unknown as RequestHandler);

export default router;
