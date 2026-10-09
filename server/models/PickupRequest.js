import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: false
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceListing',
      required: true
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
    pickupLocation: {
      address: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      coordinates: {
        lat: { type: Number, default: 17.3850 },
        lng: { type: Number, default: 78.4867 }
      }
    },
    destinationLocation: {
      address: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: '' }
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    actualPickupDate: {
      type: Date
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
    driverDetails: {
      driverName: { type: String, default: 'Raju Transport' },
      driverPhone: { type: String, default: '+91 98765 43210' },
      vehicleNumber: { type: String, default: 'TS 08 AB 1234' },
      vehicleType: { type: String, default: 'Mini Truck / Tractor-Trolley' }
    },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'Scheduled', 'In-Transit', 'Collected', 'Completed', 'Cancelled'],
      default: 'Requested'
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        notes: String
      }
    ],
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.models.PickupRequest || mongoose.model('PickupRequest', pickupRequestSchema);
