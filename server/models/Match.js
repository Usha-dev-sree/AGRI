import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceListing',
      required: true
    },
    requirementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Requirement',
      required: false
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    processorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Processor',
      required: true
    },
    matchScore: {
      type: Number,
      required: true // 0 - 100 percentage
    },
    distanceKm: {
      type: Number,
      default: 0
    },
    matchedFactors: {
      wasteCompatibility: Number,
      quantitySuitability: Number,
      distanceSuitability: Number,
      priceCompatibility: Number
    },
    status: {
      type: String,
      enum: ['Suggested', 'Inquired', 'Accepted', 'Declined', 'Scheduled'],
      default: 'Suggested'
    },
    initiatorRole: {
      type: String,
      enum: ['farmer', 'processor', 'system'],
      default: 'system'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Match || mongoose.model('Match', matchSchema);
