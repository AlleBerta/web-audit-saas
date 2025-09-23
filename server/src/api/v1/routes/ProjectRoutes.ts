import { Router } from 'express';
import { RequestHandler } from 'express';
import { createProject, getProjects, getProjectsTab } from '../controllers/ProjectController';

const router = Router();

// router.get('/', getProjects);
router.get('/tab', getProjectsTab as unknown as RequestHandler);
router.get('/:id', getProjects as unknown as RequestHandler);

// RIGUARDALA
router.post('/', createProject as unknown as RequestHandler);

export default router;
