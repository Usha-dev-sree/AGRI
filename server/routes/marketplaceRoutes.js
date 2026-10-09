import express from 'express';
import { getMarketplaceListings, getListingById, createListing, getMyListings } from '../controllers/marketplaceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getMarketplaceListings);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getListingById);
router.post('/', protect, authorize('farmer', 'admin'), upload.single('image'), createListing);

export default router;
