import express from 'express';
import { createRole, createUser, deleteRole, deleteUser, getAllRequests, getRoles, getUsers, login, refreshToken, updateRequest, updateRole, updateUser } from '../controllers/adminController.js';
import { authenticateAdmin, authorize } from '../middleware/adminAuthMiddleware.js';
const router = express.Router();

// Public
router.post('/auth/login', login);
router.post('/auth/refresh', refreshToken);

// Protected
router.get('/users', authenticateAdmin, authorize('manage_users'), getUsers);
router.post('/users', authenticateAdmin, authorize('manage_users'), createUser);
router.put('/users/:id', authenticateAdmin, authorize('manage_users'), updateUser);
router.delete('/users/:id', authenticateAdmin, authorize('manage_users'), deleteUser);

router.get('/roles', authenticateAdmin, authorize('manage_roles'), getRoles);
router.post('/roles', authenticateAdmin, authorize('manage_roles'), createRole);
router.put('/roles/:id', authenticateAdmin, authorize('manage_roles'), updateRole);
router.delete('/roles/:id', authenticateAdmin, authorize('manage_roles'), deleteRole);

router.get('/requests', authenticateAdmin, authorize('manage_requests'), getAllRequests);
router.put('/requests/:id', authenticateAdmin, authorize('manage_requests'), updateRequest);

export default router;
