import mongoose from 'mongoose';

const pathwaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    category: {
      type: String,
      enum: ['Composting & Bio-fertilizer', 'Biomass Fuel & Briquetting', 'Biochar & Soil Amendment', 'Biogas & Bio-CNG', 'Animal Feed / Fodder', 'Industrial Paper & Pulp', 'Mushroom Cultivation'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    suitableWasteTypes: [
      {
        type: String
      }
    ],
    minimumQuantityKg: {
      type: Number,
      default: 100
    },
    estimatedValueRange: {
      minPerTon: { type: Number, required: true },
      maxPerTon: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    carbonOffsetFactor: {
      type: Number, // kg of CO2e avoided per kg of waste diverted
      default: 1.2
    },
    environmentalBenefit: {
      type: String,
      required: true
    },
    processingRequirements: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Deprecated'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Pathway || mongoose.model('Pathway', pathwaySchema);
