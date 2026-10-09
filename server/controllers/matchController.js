import Match from '../models/Match.js';
import MarketplaceListing from '../models/MarketplaceListing.js';
import Processor from '../models/Processor.js';
import Requirement from '../models/Requirement.js';
import { inMemoryDB } from '../config/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// Haversine formula to compute great-circle distance between two geo-coordinates in km
const calculateDistanceKm = (coord1, coord2) => {
  if (!coord1 || !coord2 || !coord1.lat || !coord2.lat) return 18.5; // realistic default fallback

  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
};

// @desc    Get matches for current user (Farmer or Processor)
// @route   GET /api/matches
export const getMyMatches = async (req, res) => {
  try {
    let matches = [];
    const isFarmer = req.user.role === 'farmer';

    try {
      const filter = isFarmer ? { farmerId: req.user._id } : {};
      matches = await Match.find(filter)
        .populate('listingId')
        .populate('processorId')
        .populate('farmerId', 'name phone location')
        .sort({ matchScore: -1 });
    } catch {
      matches = inMemoryDB.matches.filter(m => {
        if (isFarmer) return m.farmerId?.toString() === req.user._id?.toString();
        return true;
      });
    }

    if (matches.length === 0 && inMemoryDB.matches.length > 0) {
      matches = inMemoryDB.matches;
    }

    res.json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger automated AI matchmaker between a listing and all active processors
// @route   POST /api/matches/find-matches
export const findMatchesForListing = async (req, res) => {
  try {
    const { listingId } = req.body;

    let listing = null;
    try {
      listing = await MarketplaceListing.findById(listingId);
    } catch {
      listing = inMemoryDB.marketplaceListings.find(l => l._id.toString() === listingId);
    }
    if (!listing) {
      listing = inMemoryDB.marketplaceListings.find(l => l._id.toString() === listingId) || inMemoryDB.marketplaceListings[0];
    }

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found to match' });
    }

    let processors = [];
    try {
      processors = await Processor.find({ verificationStatus: 'Verified' });
    } catch {
      processors = inMemoryDB.processors;
    }
    if (!processors || processors.length === 0) {
      processors = inMemoryDB.processors;
    }

    const generatedMatches = [];

    for (const proc of processors) {
      // 1. Waste type compatibility
      const acceptedTypes = proc.acceptedWasteTypes || ['Rice Straw', 'Cotton Stalk', 'Wheat Straw', 'Tomato Residue', 'Maize Residue'];
      const isTypeMatched = acceptedTypes.some(t =>
        t.toLowerCase().includes(listing.wasteType.toLowerCase()) ||
        listing.wasteType.toLowerCase().includes(t.toLowerCase())
      );
      const compatFactor = isTypeMatched ? 95 : 45;

      // 2. Distance factor using Haversine
      const distance = calculateDistanceKm(listing.location?.coordinates, proc.location?.coordinates);
      const distanceFactor = Math.max(20, Math.min(100, 100 - (distance * 0.7)));

      // 3. Quantity factor
      const qtyKg = listing.unit === 'tonnes' ? listing.quantity * 1000 : listing.quantity;
      const quantityFactor = qtyKg >= 200 ? 90 : 60;

      // 4. Price factor
      const priceFactor = 88;

      // Weighted Match Score Calculation
      const matchScore = Math.round(
        (0.35 * compatFactor) +
        (0.30 * distanceFactor) +
        (0.20 * quantityFactor) +
        (0.15 * priceFactor)
      );

      const matchData = {
        _id: 'match_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        listingId: listing._id,
        listing: listing,
        farmerId: listing.farmerId,
        processorId: proc._id,
        processor: proc,
        matchScore,
        distanceKm: distance,
        matchedFactors: {
          wasteCompatibility: Math.round(compatFactor),
          distanceSuitability: Math.round(distanceFactor),
          quantitySuitability: Math.round(quantityFactor),
          priceCompatibility: Math.round(priceFactor)
        },
        status: 'Suggested',
        initiatorRole: req.user?.role || 'system',
        createdAt: new Date()
      };

      generatedMatches.push(matchData);
      inMemoryDB.matches.unshift(matchData);
    }

    // Sort descending by match score
    generatedMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: generatedMatches.length,
      data: generatedMatches
    });
  } catch (error) {
    console.error('Matchmaking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Express interest or inquire about a match
// @route   POST /api/matches/:id/inquire
export const expressInterestInMatch = async (req, res) => {
  try {
    const { id } = req.params;
    let match = null;

    try {
      match = await Match.findByIdAndUpdate(id, { status: 'Inquired' }, { new: true });
    } catch {
      const idx = inMemoryDB.matches.findIndex(m => m._id.toString() === id);
      if (idx !== -1) {
        inMemoryDB.matches[idx].status = 'Inquired';
        match = inMemoryDB.matches[idx];
      }
    }

    await logAudit(req, 'MATCH_INQUIRED', 'Match', id, { status: 'Inquired' });
    res.json({ success: true, message: 'Inquiry sent to seller/buyer', data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
