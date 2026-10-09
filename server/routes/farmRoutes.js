import express from 'express';
import { getMyFarms, createFarm, deleteFarm } from '../controllers/farmController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getMyFarms).post(authorize('farmer', 'admin'), createFarm);
router.route('/:id').delete(authorize('farmer', 'admin'), deleteFarm);

export default router;
