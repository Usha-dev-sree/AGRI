import express from 'express';
import { getAllProcessors, getMyProcessorProfile, createRequirement, getRequirements } from '../controllers/processorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProcessors);
router.get('/requirements', getRequirements);
router.get('/profile', protect, getMyProcessorProfile);
router.post('/requirements', protect, authorize('processor', 'admin'), createRequirement);

export default router;
