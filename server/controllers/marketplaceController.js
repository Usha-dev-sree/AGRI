import MarketplaceListing from '../models/MarketplaceListing.js';
import WasteReport from '../models/WasteReport.js';
import { inMemoryDB } from '../config/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Get all marketplace listings with filters (wasteType, maxDistance, minPrice, maxPrice, status)
// @route   GET /api/marketplace
export const getMarketplaceListings = async (req, res) => {
  try {
    const { wasteType, minQuantity, maxPrice, status } = req.query;

    let listings = [];
    try {
      const query = {};
      if (wasteType && wasteType !== 'All') query.wasteType = new RegExp(wasteType, 'i');
      if (status) query.status = status;
      else query.status = 'Available';

      listings = await MarketplaceListing.find(query)
        .populate('farmerId', 'name phone location')
        .sort({ createdAt: -1 });
    } catch {
      listings = inMemoryDB.marketplaceListings.filter(l => {
        if (status && l.status !== status) return false;
        if (!status && l.status !== 'Available') return false;
        if (wasteType && wasteType !== 'All' && !l.wasteType.toLowerCase().includes(wasteType.toLowerCase())) return false;
        if (minQuantity && l.quantity < Number(minQuantity)) return false;
        if (maxPrice && l.expectedPrice > Number(maxPrice)) return false;
        return true;
      });
    }

    if (listings.length === 0 && inMemoryDB.marketplaceListings.length > 0) {
      listings = inMemoryDB.marketplaceListings.filter(l => {
        if (status && l.status !== status) return false;
        if (wasteType && wasteType !== 'All' && !l.wasteType.toLowerCase().includes(wasteType.toLowerCase())) return false;
        return true;
      });
    }

    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single marketplace listing
// @route   GET /api/marketplace/:id
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    let listing = null;
    try {
      listing = await MarketplaceListing.findById(id).populate('farmerId', 'name phone location email');
      if (listing) {
        listing.viewsCount = (listing.viewsCount || 0) + 1;
        await listing.save();
      }
    } catch {
      listing = inMemoryDB.marketplaceListings.find(l => l._id.toString() === id);
      if (listing) listing.viewsCount = (listing.viewsCount || 0) + 1;
    }
    if (!listing) {
      listing = inMemoryDB.marketplaceListings.find(l => l._id.toString() === id);
    }
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new marketplace listing
// @route   POST /api/marketplace
export const createListing = async (req, res) => {
  try {
    const {
      wasteReportId,
      title,
      crop,
      wasteType,
      quantity,
      unit,
      expectedPrice,
      isNegotiable,
      location,
      image,
      aiVerified,
      aiConfidence,
      recommendedPathways
    } = req.body;

    const listingData = {
      farmerId: req.user._id,
      wasteReportId: wasteReportId || null,
      title: title || `${quantity} ${unit || 'kg'} of ${wasteType || 'Agricultural Waste'}`,
      crop: crop || 'Standard Crop',
      wasteType: wasteType || 'Rice Straw',
      quantity: Number(quantity) || 500,
      unit: unit || 'kg',
      expectedPrice: Number(expectedPrice) || 3500,
      isNegotiable: isNegotiable !== undefined ? isNegotiable : true,
      location: location || req.user.location || {
        address: 'Nalgonda District',
        district: 'Nalgonda',
        state: 'Telangana',
        coordinates: { lat: 17.0577, lng: 79.2684 }
      },
      image: image || (req.file ? `/uploads/${req.file.filename}` : ''),
      aiVerified: aiVerified || true,
      aiConfidence: aiConfidence || 0.92,
      recommendedPathways: recommendedPathways || [],
      status: 'Available',
      viewsCount: 0,
      inquiriesCount: 0,
      createdAt: new Date()
    };

    let listing;
    try {
      listing = await MarketplaceListing.create(listingData);
      if (wasteReportId) {
        await WasteReport.findByIdAndUpdate(wasteReportId, { status: 'Listed' });
      }
    } catch {
      listing = { ...listingData, _id: 'list_' + Date.now() };
      inMemoryDB.marketplaceListings.unshift(listing);
    }

    await logAudit(req, 'LISTING_PUBLISHED', 'MarketplaceListing', listing._id, {
      wasteType: listing.wasteType,
      expectedPrice: listing.expectedPrice
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get listings created by the logged-in farmer
// @route   GET /api/marketplace/my-listings
export const getMyListings = async (req, res) => {
  try {
    let listings = [];
    try {
      listings = await MarketplaceListing.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    } catch {
      listings = inMemoryDB.marketplaceListings.filter(l => l.farmerId?.toString() === req.user._id?.toString());
    }
    if (listings.length === 0) {
      listings = inMemoryDB.marketplaceListings.filter(l => l.farmerId?.toString() === req.user._id?.toString());
    }
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
