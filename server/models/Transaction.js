import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    pickupRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      required: false
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceListing',
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
    agreedPrice: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer (NEFT/IMPS)', 'UPI Direct', 'Cash on Pickup', 'Platform Escrow (Simulated)'],
      default: 'UPI Direct'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionReference: {
      type: String,
      default: () => `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    },
    transactionDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
