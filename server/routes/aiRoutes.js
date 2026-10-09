import express from 'express';
import { classifyWasteImage } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/classify', upload.single('file'), classifyWasteImage);

export default router;
