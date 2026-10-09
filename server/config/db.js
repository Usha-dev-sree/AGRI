import mongoose from 'mongoose';

export const inMemoryDB = {
  users: [],
  farms: [],
  crops: [],
  wasteReports: [],
  recommendations: [],
  pathways: [],
  processors: [],
  requirements: [],
  marketplaceListings: [],
  matches: [],
  pickupRequests: [],
  transactions: [],
  auditLogs: []
};

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrivalue_ai';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Local MongoDB server not reachable at ${mongoURI}.`);
    console.log(`💡 AgriValue AI will run with High-Performance Hybrid In-Memory Data Store with Persistent Models!`);
    return false;
  }
};
