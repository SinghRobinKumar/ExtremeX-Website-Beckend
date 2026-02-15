import express from 'express';
import {
    createTheme,
    deleteTheme,
    getActiveTheme,
    getThemeById,
    getThemes,
    setActiveTheme,
    updateTheme
} from '../controllers/themeController.js';

import { authenticateAdmin, authorize } from '../middleware/adminAuthMiddleware.js';


const router = express.Router();

// Public route - get active theme
router.get('/active', getActiveTheme);

// Protected admin routes
router.get('/', authenticateAdmin, authorize(['admin', 'super_admin']), getThemes);
router.get('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), getThemeById);
router.post('/', authenticateAdmin, authorize(['admin', 'super_admin']), createTheme);
router.put('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), updateTheme);
router.put('/:id/activate', authenticateAdmin, authorize(['admin', 'super_admin']), setActiveTheme);
router.delete('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), deleteTheme);

export default router;
