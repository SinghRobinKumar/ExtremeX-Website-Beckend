import express from 'express';
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  getServiceBySlug,
  updateService
} from '../controllers/serviceController.js';
import { authenticateAdmin, authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getAllServices);
router.get('/slug/:slug', getServiceBySlug);
router.get('/:id', getServiceById);

// Protected Admin Routes
// Assuming 'manage_services' permission or 'all'
router.post('/', authenticateAdmin, authorize('all'), createService); // Using 'all' for now, can be specific
router.put('/:id', authenticateAdmin, authorize('all'), updateService);
router.delete('/:id', authenticateAdmin, authorize('all'), deleteService);

export default router;
