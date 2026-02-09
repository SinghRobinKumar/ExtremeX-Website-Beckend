import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateAdmin } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Protected route - only admins can upload service images
// Expecting the file input name to be 'image'
router.post('/', authenticateAdmin, upload.single('image'), uploadImage);

export default router;
