import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    wasteReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteReport',
      required: true
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'kg'
    },
    recommendations: [
      {
        pathwayId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pathway'
        },
        pathwayName: { type: String, required: true },
        score: { type: Number, required: true }, // 0 to 100 percentage
        estimatedValueTotal: { type: Number, required: true },
        estimatedValuePerUnit: { type: Number, required: true },
        carbonOffsetKg: { type: Number, default: 0 },
        scoreFactors: {
          wasteCompatibility: Number,
          processorDemand: Number,
          quantitySuitability: Number,
          estimatedValue: Number,
          distanceSuitability: Number,
          environmentalScore: Number
        },
        reasons: [String]
      }
    ],
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);
