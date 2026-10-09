import WasteReport from '../models/WasteReport.js';
import Farm from '../models/Farm.js';
import { inMemoryDB } from '../config/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Get all waste reports for farmer
// @route   GET /api/waste
export const getMyWasteReports = async (req, res) => {
  try {
    let reports = [];
    try {
      reports = await WasteReport.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    } catch {
      reports = inMemoryDB.wasteReports.filter(w => w.farmerId?.toString() === req.user._id?.toString());
    }
    if (reports.length === 0) {
      reports = inMemoryDB.wasteReports.filter(w => w.farmerId?.toString() === req.user._id?.toString());
    }
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single waste report by ID
// @route   GET /api/waste/:id
export const getWasteReportById = async (req, res) => {
  try {
    const { id } = req.params;
    let report = null;
    try {
      report = await WasteReport.findById(id).populate('farmerId', 'name phone location');
    } catch {
      report = inMemoryDB.wasteReports.find(w => w._id.toString() === id);
    }
    if (!report) {
      report = inMemoryDB.wasteReports.find(w => w._id.toString() === id);
    }
    if (!report) {
      return res.status(404).json({ success: false, message: 'Waste report not found' });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new agricultural waste record
// @route   POST /api/waste
export const createWasteReport = async (req, res) => {
  try {
    const {
      farmId,
      cropId,
      crop,
      wasteType,
      quantity,
      unit,
      moistureContent,
      storageCondition,
      location,
      aiAnalysis,
      image
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (image || '');

    const parsedAiAnalysis = typeof aiAnalysis === 'string' ? JSON.parse(aiAnalysis) : (aiAnalysis || {});
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : (location || req.user.location);

    const wasteData = {
      farmerId: req.user._id,
      farmId: farmId || null,
      cropId: cropId || null,
      crop: crop || 'General Crop',
      wasteType: wasteType || 'Crop Biomass Residue',
      quantity: Number(quantity) || 100,
      unit: unit || 'kg',
      moistureContent: moistureContent || 'Medium (15-30%)',
      storageCondition: storageCondition || 'Covered Shed',
      location: parsedLocation,
      image: imageUrl,
      aiAnalysis: {
        predictedClass: parsedAiAnalysis.predictedClass || wasteType,
        confidence: parsedAiAnalysis.confidence || 0.90,
        topPredictions: parsedAiAnalysis.topPredictions || [],
        inferenceTimeMs: parsedAiAnalysis.inferenceTimeMs || 42,
        detectedAt: new Date()
      },
      status: 'Reported',
      createdAt: new Date(),
      availabilityDate: new Date()
    };

    let wasteReport;
    try {
      wasteReport = await WasteReport.create(wasteData);
    } catch {
      wasteReport = { ...wasteData, _id: 'waste_' + Date.now() };
      inMemoryDB.wasteReports.unshift(wasteReport);
    }

    await logAudit(req, 'WASTE_LOGGED', 'WasteReport', wasteReport._id, {
      wasteType: wasteReport.wasteType,
      quantity: wasteReport.quantity
    });

    res.status(201).json({ success: true, data: wasteReport });
  } catch (error) {
    console.error('Create waste error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update waste report status
// @route   PATCH /api/waste/:id/status
export const updateWasteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updated = null;
    try {
      updated = await WasteReport.findByIdAndUpdate(id, { status }, { new: true });
    } catch {
      const idx = inMemoryDB.wasteReports.findIndex(w => w._id.toString() === id);
      if (idx !== -1) {
        inMemoryDB.wasteReports[idx].status = status;
        updated = inMemoryDB.wasteReports[idx];
      }
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
