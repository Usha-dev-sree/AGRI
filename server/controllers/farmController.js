import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import { inMemoryDB } from '../config/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Get all farms for the logged-in farmer
// @route   GET /api/farms
export const getMyFarms = async (req, res) => {
  try {
    let farms = [];
    try {
      farms = await Farm.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    } catch {
      farms = inMemoryDB.farms.filter(f => f.farmerId?.toString() === req.user._id?.toString());
    }
    if (farms.length === 0) {
      farms = inMemoryDB.farms.filter(f => f.farmerId?.toString() === req.user._id?.toString());
    }
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new farm profile
// @route   POST /api/farms
export const createFarm = async (req, res) => {
  try {
    const { farmName, location, area, areaUnit, soilType, irrigationType } = req.body;

    const farmData = {
      farmerId: req.user._id,
      farmName,
      location: location || {
        address: 'Nalgonda District',
        district: 'Nalgonda',
        state: 'Telangana',
        coordinates: { lat: 17.0577, lng: 79.2684 }
      },
      area: Number(area) || 5,
      areaUnit: areaUnit || 'acres',
      soilType: soilType || 'Black Soil',
      irrigationType: irrigationType || 'Drip Irrigation',
      createdAt: new Date()
    };

    let farm;
    try {
      farm = await Farm.create(farmData);
    } catch {
      farm = { ...farmData, _id: 'farm_' + Date.now() };
      inMemoryDB.farms.unshift(farm);
    }

    await logAudit(req, 'FARM_CREATED', 'Farm', farm._id, { farmName: farm.farmName });
    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a farm
// @route   DELETE /api/farms/:id
export const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Farm.findByIdAndDelete(id);
      await Crop.deleteMany({ farmId: id });
    } catch {
      inMemoryDB.farms = inMemoryDB.farms.filter(f => f._id.toString() !== id);
      inMemoryDB.crops = inMemoryDB.crops.filter(c => c.farmId?.toString() !== id);
    }
    res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
