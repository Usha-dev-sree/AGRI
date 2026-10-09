import Crop from '../models/Crop.js';
import { inMemoryDB } from '../config/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Get all crops for the logged in farmer
// @route   GET /api/crops
export const getMyCrops = async (req, res) => {
  try {
    let crops = [];
    try {
      crops = await Crop.find({ farmerId: req.user._id }).populate('farmId', 'farmName location').sort({ createdAt: -1 });
    } catch {
      crops = inMemoryDB.crops.filter(c => c.farmerId?.toString() === req.user._id?.toString());
    }
    if (crops.length === 0) {
      crops = inMemoryDB.crops.filter(c => c.farmerId?.toString() === req.user._id?.toString());
    }
    res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new crop cultivation entry
// @route   POST /api/crops
export const createCrop = async (req, res) => {
  try {
    const { farmId, cropName, variety, season, sowingDate, harvestDate, estimatedProduction, productionUnit, status } = req.body;

    const cropData = {
      farmerId: req.user._id,
      farmId: farmId || (inMemoryDB.farms.find(f => f.farmerId?.toString() === req.user._id?.toString())?._id) || 'farm_default',
      cropName,
      variety: variety || 'Standard Hybrid',
      season: season || 'Kharif (Monsoon)',
      sowingDate: sowingDate || new Date(Date.now() - 60 * 24 * 3600 * 1000),
      harvestDate: harvestDate || new Date(Date.now() + 30 * 24 * 3600 * 1000),
      estimatedProduction: Number(estimatedProduction) || 5,
      productionUnit: productionUnit || 'tonnes',
      status: status || 'Growing',
      createdAt: new Date()
    };

    let crop;
    try {
      crop = await Crop.create(cropData);
    } catch {
      crop = { ...cropData, _id: 'crop_' + Date.now() };
      inMemoryDB.crops.unshift(crop);
    }

    await logAudit(req, 'CROP_CREATED', 'Crop', crop._id, { cropName: crop.cropName, season: crop.season });
    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a crop
// @route   DELETE /api/crops/:id
export const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Crop.findByIdAndDelete(id);
    } catch {
      inMemoryDB.crops = inMemoryDB.crops.filter(c => c._id.toString() !== id);
    }
    res.json({ success: true, message: 'Crop record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
