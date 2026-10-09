import PickupRequest from '../models/PickupRequest.js';
import MarketplaceListing from '../models/MarketplaceListing.js';
import Transaction from '../models/Transaction.js';
import { inMemoryDB } from '../config/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Get all pickup requests for the logged in user
// @route   GET /api/pickups
export const getMyPickups = async (req, res) => {
  try {
    let pickups = [];
    const isFarmer = req.user.role === 'farmer';

    try {
      const query = isFarmer ? { farmerId: req.user._id } : {};
      pickups = await PickupRequest.find(query)
        .populate('farmerId', 'name phone location')
        .populate('processorId')
        .populate('listingId')
        .sort({ createdAt: -1 });
    } catch {
      pickups = inMemoryDB.pickupRequests.filter(p => {
        if (isFarmer) return p.farmerId?.toString() === req.user._id?.toString();
        return true;
      });
    }

    if (pickups.length === 0 && inMemoryDB.pickupRequests.length > 0) {
      pickups = inMemoryDB.pickupRequests;
    }

    res.json({ success: true, count: pickups.length, data: pickups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new pickup request
// @route   POST /api/pickups
export const createPickupRequest = async (req, res) => {
  try {
    const {
      listingId,
      matchId,
      farmerId,
      processorId,
      pickupLocation,
      scheduledDate,
      wasteType,
      quantity,
      unit,
      agreedPrice,
      notes
    } = req.body;

    const pickupData = {
      listingId: listingId || inMemoryDB.marketplaceListings[0]?._id || 'list_default',
      matchId: matchId || null,
      farmerId: farmerId || req.user._id,
      processorId: processorId || inMemoryDB.processors[0]?._id || 'proc_default',
      pickupLocation: pickupLocation || req.user.location || {
        address: 'Green Valley Farm, Nalgonda',
        district: 'Nalgonda',
        state: 'Telangana',
        coordinates: { lat: 17.0577, lng: 79.2684 }
      },
      scheduledDate: scheduledDate || new Date(Date.now() + 2 * 24 * 3600 * 1000),
      wasteType: wasteType || 'Rice Straw Residue',
      quantity: Number(quantity) || 1200,
      unit: unit || 'kg',
      agreedPrice: Number(agreedPrice) || 4500,
      driverDetails: {
        driverName: 'Suresh Transport Logistics',
        driverPhone: '+91 94401 23456',
        vehicleNumber: 'TS 08 TC 5492',
        vehicleType: 'Tractor-Trolley (3 Ton Capacity)'
      },
      status: 'Scheduled',
      statusHistory: [
        { status: 'Requested', timestamp: new Date(Date.now() - 3600 * 1000), notes: 'Pickup scheduled by processor' },
        { status: 'Scheduled', timestamp: new Date(), notes: 'Logistics vehicle dispatched & driver assigned' }
      ],
      notes: notes || 'Field accessible via main rural bypass road',
      createdAt: new Date()
    };

    let pickup;
    try {
      pickup = await PickupRequest.create(pickupData);
      if (listingId) {
        await MarketplaceListing.findByIdAndUpdate(listingId, { status: 'Reserved' });
      }
    } catch {
      pickup = { ...pickupData, _id: 'pick_' + Date.now() };
      inMemoryDB.pickupRequests.unshift(pickup);
    }

    await logAudit(req, 'PICKUP_REQUESTED', 'PickupRequest', pickup._id, {
      wasteType: pickup.wasteType,
      scheduledDate: pickup.scheduledDate
    });

    res.status(201).json({ success: true, data: pickup });
  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update 6-stage pickup status (Requested -> Accepted -> Scheduled -> In-Transit -> Collected -> Completed)
// @route   PATCH /api/pickups/:id/status
export const updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, driverDetails } = req.body;

    let updated = null;
    try {
      const pickup = await PickupRequest.findById(id);
      if (pickup) {
        pickup.status = status;
        if (driverDetails) pickup.driverDetails = driverDetails;
        pickup.statusHistory.push({
          status,
          timestamp: new Date(),
          notes: notes || `Status transitioned to ${status}`
        });

        if (status === 'Completed') {
          pickup.actualPickupDate = new Date();
          // Auto create settlement transaction
          await Transaction.create({
            pickupRequestId: pickup._id,
            listingId: pickup.listingId,
            farmerId: pickup.farmerId,
            processorId: pickup.processorId,
            wasteType: pickup.wasteType,
            quantity: pickup.quantity,
            unit: pickup.unit,
            agreedPrice: pickup.agreedPrice,
            paymentStatus: 'Paid',
            transactionDate: new Date()
          });
        }
        await pickup.save();
        updated = pickup;
      }
    } catch {
      const idx = inMemoryDB.pickupRequests.findIndex(p => p._id.toString() === id);
      if (idx !== -1) {
        inMemoryDB.pickupRequests[idx].status = status;
        if (driverDetails) inMemoryDB.pickupRequests[idx].driverDetails = driverDetails;
        inMemoryDB.pickupRequests[idx].statusHistory.push({
          status,
          timestamp: new Date(),
          notes: notes || `Status transitioned to ${status}`
        });

        if (status === 'Completed') {
          inMemoryDB.transactions.unshift({
            _id: 'txn_' + Date.now(),
            pickupRequestId: id,
            farmerId: inMemoryDB.pickupRequests[idx].farmerId,
            processorId: inMemoryDB.pickupRequests[idx].processorId,
            wasteType: inMemoryDB.pickupRequests[idx].wasteType,
            quantity: inMemoryDB.pickupRequests[idx].quantity,
            agreedPrice: inMemoryDB.pickupRequests[idx].agreedPrice,
            paymentStatus: 'Paid',
            transactionReference: `TXN-${Date.now()}-8821`,
            transactionDate: new Date()
          });
        }
        updated = inMemoryDB.pickupRequests[idx];
      }
    }

    await logAudit(req, 'PICKUP_STATUS_UPDATED', 'PickupRequest', id, { newStatus: status });

    res.json({ success: true, message: `Pickup updated to ${status}`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
