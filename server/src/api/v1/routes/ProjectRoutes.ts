import { Router } from 'express';
import { createProject } from '../controllers/ProjectController';

const router = Router();

router.get('/test', createProject);

export default router;
