import express from 'express';
import { generateRecommendations, getPathways } from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/pathways', getPathways);
router.post('/generate', generateRecommendations);

export default router;
