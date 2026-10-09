import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmName: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      address: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      coordinates: {
        lat: { type: Number, default: 17.3850 },
        lng: { type: Number, default: 78.4867 }
      }
    },
    area: {
      type: Number,
      required: true
    },
    areaUnit: {
      type: String,
      enum: ['acres', 'hectares', 'bigha', 'guntha'],
      default: 'acres'
    },
    soilType: {
      type: String,
      enum: ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Clayey Soil', 'Sandy Loam', 'Laterite Soil'],
      default: 'Black Soil'
    },
    irrigationType: {
      type: String,
      enum: ['Drip Irrigation', 'Sprinkler', 'Canal / Flood', 'Rainfed', 'Borewell / Tube Well'],
      default: 'Drip Irrigation'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Farm || mongoose.model('Farm', farmSchema);
