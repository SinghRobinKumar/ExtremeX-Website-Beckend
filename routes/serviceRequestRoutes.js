import express from 'express';
import { createRequest, getUserRequests } from '../controllers/serviceRequestController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authenticateToken, createRequest);
router.get('/', authenticateToken, getUserRequests);

export default router;
