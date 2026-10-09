import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema(
  {
    processorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Processor',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    wasteTypes: [
      {
        type: String,
        required: true
      }
    ],
    targetQuantity: {
      type: Number,
      required: true
    },
    fulfilledQuantity: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      enum: ['tonnes', 'quintals', 'kg'],
      default: 'tonnes'
    },
    offeredPricePerUnit: {
      type: Number,
      required: true
    },
    maxProcurementDistanceKm: {
      type: Number,
      default: 100
    },
    preferredMoisture: {
      type: String,
      default: 'Medium (15-30%)'
    },
    deadlineDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Partially Fulfilled', 'Fulfilled', 'Closed'],
      default: 'Open'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.models.Requirement || mongoose.model('Requirement', requirementSchema);
