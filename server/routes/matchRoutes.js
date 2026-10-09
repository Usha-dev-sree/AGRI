import express from 'express';
import { getMyMatches, findMatchesForListing, expressInterestInMatch } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getMyMatches);
router.post('/find-matches', findMatchesForListing);
router.post('/:id/inquire', expressInterestInMatch);

export default router;
