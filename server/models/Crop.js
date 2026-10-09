import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true
    },
    cropName: {
      type: String,
      required: true,
      trim: true
    },
    variety: {
      type: String,
      default: 'Standard Hybrid'
    },
    season: {
      type: String,
      enum: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Perennial / Multi-Season'],
      required: true
    },
    sowingDate: {
      type: Date,
      required: true
    },
    harvestDate: {
      type: Date,
      required: true
    },
    estimatedProduction: {
      type: Number,
      required: true
    },
    productionUnit: {
      type: String,
      enum: ['tonnes', 'quintals', 'kg'],
      default: 'tonnes'
    },
    status: {
      type: String,
      enum: ['Sown', 'Growing', 'Harvested', 'Completed'],
      default: 'Growing'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Crop || mongoose.model('Crop', cropSchema);
