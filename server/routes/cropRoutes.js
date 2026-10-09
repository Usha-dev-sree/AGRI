import express from 'express';
import { getMyCrops, createCrop, deleteCrop } from '../controllers/cropController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getMyCrops).post(authorize('farmer', 'admin'), createCrop);
router.route('/:id').delete(authorize('farmer', 'admin'), deleteCrop);

export default router;
