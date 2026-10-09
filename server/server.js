import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { populateSeedData } from './scripts/seedData.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import wasteRoutes from './routes/wasteRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import processorRoutes from './routes/processorRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database & Seed Initial Data
connectDB().then(() => {
  populateSeedData();
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'AgriValue AI - MERN API Backend',
    version: '1.0.0',
    timestamp: new Date(),
    modules: [
      'Auth & Role Management',
      'Farm Management',
      'Crop Management',
      'Waste Management',
      'AI Waste Scanner',
      'Recommendation Engine',
      'Marketplace',
      'Processor Demand',
      'Matching & Logistics',
      'Analytics & Carbon Offset'
    ]
  });
});

// Mount Routes
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

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 AgriValue AI Server listening on http://localhost:${PORT}`);
  console.log(`🌾 API Health available at: http://localhost:${PORT}/api/health`);
});
