import express from 'express';
import {
    createProject,
    deleteProject,
    getProjectById,
    getProjects,
    getPublishedProjects,
    updateProject
} from '../controllers/projectController.js';
import { authenticateAdmin, authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public route - get published projects
router.get('/published', getPublishedProjects);

// Protected admin routes
router.get('/', authenticateAdmin, authorize(['admin', 'super_admin']), getProjects);
router.get('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), getProjectById);
router.post('/', authenticateAdmin, authorize(['admin', 'super_admin']), createProject);
router.put('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), updateProject);
router.delete('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), deleteProject);

export default router;
