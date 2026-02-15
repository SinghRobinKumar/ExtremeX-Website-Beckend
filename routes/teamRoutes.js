import express from 'express';
import {
    createTeamMember,
    deleteTeamMember,
    getTeamMemberById,
    getTeamMembers,
    updateTeamMember
} from '../controllers/teamController.js';
import { authenticateAdmin, authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public route - get all team members
router.get('/', getTeamMembers);

// Protected admin routes
router.get('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), getTeamMemberById);
router.post('/', authenticateAdmin, authorize(['admin', 'super_admin']), createTeamMember);
router.put('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), updateTeamMember);
router.delete('/:id', authenticateAdmin, authorize(['admin', 'super_admin']), deleteTeamMember);

export default router;
