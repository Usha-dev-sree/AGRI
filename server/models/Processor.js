import mongoose from 'mongoose';

const processorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    processorType: {
      type: String,
      enum: [
        'Biomass Fuel / Briquetting Plant',
        'Biochar & Soil Carbon Facility',
        'Commercial Composting Unit',
        'Bio-CNG / Biogas Plant',
        'Cattle Feed & Fodder Mill',
        'Paper, Cardboard & Pulp Mill',
        'Circular Agro-Industrial Recycler'
      ],
      required: true
    },
    registrationNumber: {
      type: String,
      default: ''
    },
    gstin: {
      type: String,
      default: ''
    },
    capacityMonthlyTons: {
      type: Number,
      default: 50
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
    contactPerson: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' }
    },
    acceptedWasteTypes: [
      {
        type: String
      }
    ],
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Pending Verification', 'Rejected'],
      default: 'Verified'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Processor || mongoose.model('Processor', processorSchema);
