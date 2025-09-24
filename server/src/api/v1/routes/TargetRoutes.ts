import { Router } from 'express';
import { RequestHandler } from 'express';
import { createTarget, deleteTarget } from '../controllers/TargetController';

const router = Router();

router.post('/', createTarget as unknown as RequestHandler);
router.delete('/:targetId', deleteTarget as unknown as RequestHandler);
export default router;
