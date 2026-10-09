import express from 'express';
import { getMyPickups, createPickupRequest, updatePickupStatus } from '../controllers/pickupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getMyPickups).post(createPickupRequest);
router.route('/:id/status').patch(updatePickupStatus);

export default router;
