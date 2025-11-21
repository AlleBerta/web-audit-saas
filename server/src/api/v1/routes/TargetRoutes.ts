import { Router } from 'express';
import { RequestHandler } from 'express';
import {
  createTarget,
  deleteTarget,
  getAllCVEsFromTarget,
  getDomainTarget,
} from '../controllers/TargetController';

const router = Router();

router.post('/', createTarget as unknown as RequestHandler);
router.delete('/:targetId', deleteTarget as unknown as RequestHandler);
router.get('/:targetId/domain', getDomainTarget as unknown as RequestHandler);
router.get('/:targetId/cves', getAllCVEsFromTarget as unknown as RequestHandler);
export default router;
