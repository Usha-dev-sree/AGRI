import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRoutes from '../../server/routes/authRoutes.js';
import farmRoutes from '../../server/routes/farmRoutes.js';
import cropRoutes from '../../server/routes/cropRoutes.js';
import wasteRoutes from '../../server/routes/wasteRoutes.js';
import aiRoutes from '../../server/routes/aiRoutes.js';
import recommendationRoutes from '../../server/routes/recommendationRoutes.js';
import marketplaceRoutes from '../../server/routes/marketplaceRoutes.js';
import processorRoutes from '../../server/routes/processorRoutes.js';
import matchRoutes from '../../server/routes/matchRoutes.js';
import pickupRoutes from '../../server/routes/pickupRoutes.js';
import analyticsRoutes from '../../server/routes/analyticsRoutes.js';
import { connectDB } from '../../server/config/db.js';
import { populateSeedData } from '../../server/scripts/seedData.js';

dotenv.config();

const app = express();

connectDB().then(() => {
  populateSeedData();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'AgriValue AI - MERN API Backend (Vercel Serverless)',
    version: '1.0.0',
    timestamp: new Date()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/processors', processorRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
