import express from 'express';
import { getMyWasteReports, getWasteReportById, createWasteReport, updateWasteStatus } from '../controllers/wasteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getMyWasteReports).post(upload.single('image'), createWasteReport);
router.route('/:id').get(getWasteReportById);
router.route('/:id/status').patch(updateWasteStatus);

export default router;
