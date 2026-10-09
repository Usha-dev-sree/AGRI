import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteReport',
      required: false
    },
    title: {
      type: String,
      required: true
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
      default: 'kg'
    },
    expectedPrice: {
      type: Number,
      required: true
    },
    isNegotiable: {
      type: Boolean,
      default: true
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
    image: {
      type: String,
      default: ''
    },
    aiVerified: {
      type: Boolean,
      default: false
    },
    aiConfidence: {
      type: Number,
      default: 0
    },
    recommendedPathways: [
      {
        pathwayName: String,
        score: Number
      }
    ],
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold', 'Cancelled'],
      default: 'Available'
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    inquiriesCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.models.MarketplaceListing || mongoose.model('MarketplaceListing', marketplaceListingSchema);
