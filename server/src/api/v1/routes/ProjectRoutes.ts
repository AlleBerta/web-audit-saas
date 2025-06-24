import { Router } from 'express';
import { RequestHandler } from 'express';
import { createProject, getProjects } from '../controllers/ProjectController';

const router = Router();

// router.get('/', getProjects);
router.get('/', getProjects as unknown as RequestHandler);

// RIGUARDALA
router.post('/', createProject as unknown as RequestHandler);

export default router;
