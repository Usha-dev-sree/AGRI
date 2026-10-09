import Processor from '../models/Processor.js';
import Requirement from '../models/Requirement.js';
import { inMemoryDB } from '../config/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Get all verified processors
// @route   GET /api/processors
export const getAllProcessors = async (req, res) => {
  try {
    let processors = [];
    try {
      processors = await Processor.find().populate('userId', 'name email phone');
    } catch {
      processors = inMemoryDB.processors;
    }
    if (processors.length === 0) {
      processors = inMemoryDB.processors;
    }
    res.json({ success: true, count: processors.length, data: processors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current processor's profile & requirements
// @route   GET /api/processors/profile
export const getMyProcessorProfile = async (req, res) => {
  try {
    let profile = null;
    try {
      profile = await Processor.findOne({ userId: req.user._id });
    } catch {
      profile = inMemoryDB.processors.find(p => p.userId?.toString() === req.user._id?.toString());
    }
    if (!profile) {
      profile = inMemoryDB.processors.find(p => p.userId?.toString() === req.user._id?.toString());
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create/Post a new procurement requirement by processor
// @route   POST /api/processors/requirements
export const createRequirement = async (req, res) => {
  try {
    const { title, wasteTypes, targetQuantity, unit, offeredPricePerUnit, maxProcurementDistanceKm, deadlineDate, notes } = req.body;

    let processor = null;
    try {
      processor = await Processor.findOne({ userId: req.user._id });
    } catch {
      processor = inMemoryDB.processors.find(p => p.userId?.toString() === req.user._id?.toString());
    }
    if (!processor) {
      processor = inMemoryDB.processors.find(p => p.userId?.toString() === req.user._id?.toString());
    }

    const reqData = {
      processorId: processor?._id || 'proc_default',
      userId: req.user._id,
      title: title || `Procurement for ${wasteTypes?.join(', ') || 'Agricultural Biomass'}`,
      wasteTypes: wasteTypes || ['Rice Straw', 'Cotton Stalk'],
      targetQuantity: Number(targetQuantity) || 10,
      fulfilledQuantity: 0,
      unit: unit || 'tonnes',
      offeredPricePerUnit: Number(offeredPricePerUnit) || 4500,
      maxProcurementDistanceKm: Number(maxProcurementDistanceKm) || 100,
      deadlineDate: deadlineDate || new Date(Date.now() + 30 * 24 * 3600 * 1000),
      status: 'Open',
      notes: notes || '',
      createdAt: new Date()
    };

    let requirement;
    try {
      requirement = await Requirement.create(reqData);
    } catch {
      requirement = { ...reqData, _id: 'req_' + Date.now() };
      inMemoryDB.requirements.unshift(requirement);
    }

    await logAudit(req, 'REQUIREMENT_POSTED', 'Requirement', requirement._id, {
      title: requirement.title,
      quantity: requirement.targetQuantity
    });

    res.status(201).json({ success: true, data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active procurement requirements
// @route   GET /api/processors/requirements
export const getRequirements = async (req, res) => {
  try {
    let requirements = [];
    try {
      requirements = await Requirement.find({ status: 'Open' })
        .populate('processorId', 'companyName processorType location contactPerson')
        .sort({ createdAt: -1 });
    } catch {
      requirements = inMemoryDB.requirements.filter(r => r.status === 'Open');
    }
    if (requirements.length === 0 && inMemoryDB.requirements.length > 0) {
      requirements = inMemoryDB.requirements.filter(r => r.status === 'Open');
    }
    res.json({ success: true, count: requirements.length, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
