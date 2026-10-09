import mongoose from 'mongoose';

const wasteReportSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: false
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: false
    },
    crop: {
      type: String,
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
      enum: ['kg', 'tonnes', 'quintals', 'bags'],
      default: 'kg'
    },
    moistureContent: {
      type: String,
      enum: ['Low (< 15%)', 'Medium (15-30%)', 'High (> 30%)', 'Fresh / Wet'],
      default: 'Medium (15-30%)'
    },
    storageCondition: {
      type: String,
      enum: ['Field Stacked', 'Covered Shed', 'Loose in Open', 'Baled'],
      default: 'Covered Shed'
    },
    location: {
      address: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: '' },
      coordinates: {
        lat: { type: Number, default: 17.3850 },
        lng: { type: Number, default: 78.4867 }
      }
    },
    image: {
      type: String,
      default: ''
    },
    aiAnalysis: {
      predictedClass: { type: String, default: '' },
      confidence: { type: Number, default: 0 },
      topPredictions: [
        {
          className: String,
          confidence: Number
        }
      ],
      inferenceTimeMs: { type: Number, default: 0 },
      detectedAt: { type: Date }
    },
    status: {
      type: String,
      enum: ['Reported', 'Analyzed', 'Listed', 'Matched', 'Picked Up', 'Disposed'],
      default: 'Reported'
    },
    availabilityDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.models.WasteReport || mongoose.model('WasteReport', wasteReportSchema);
