import Pathway from '../models/Pathway.js';
import Recommendation from '../models/Recommendation.js';
import WasteReport from '../models/WasteReport.js';
import Processor from '../models/Processor.js';
import { inMemoryDB } from '../config/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// Master standard pathways knowledge base
export const DEFAULT_PATHWAYS = [
  {
    name: 'Commercial Composting & Bio-Fertilizer',
    category: 'Composting & Bio-fertilizer',
    description: 'Aerobic microbial decomposition converting moist horticultural and crop residues into nutrient-rich organic compost.',
    suitableWasteTypes: ['Tomato Residue', 'Vegetable Residue', 'Maize Residue', 'Wheat Straw', 'Cotton Stalk'],
    minimumQuantityKg: 100,
    estimatedValueRange: { minPerTon: 2200, maxPerTon: 3500, currency: 'INR' },
    carbonOffsetFactor: 1.15,
    environmentalBenefit: 'Enriches soil organic carbon, eliminates synthetic fertilizer run-off, reduces landfill methane.',
    processingRequirements: ['Moisture 40-60%', 'C:N Ratio 25-30:1', 'Periodic Turnings']
  },
  {
    name: 'Biomass Fuel & Briquetting',
    category: 'Biomass Fuel & Briquetting',
    description: 'High-pressure mechanical densification into calorific briquettes and pellets replacing coal in boilers and industrial kilns.',
    suitableWasteTypes: ['Rice Straw', 'Cotton Stalk', 'Wheat Straw', 'Maize Residue', 'Sugarcane Bagasse', 'Groundnut Residue'],
    minimumQuantityKg: 300,
    estimatedValueRange: { minPerTon: 4000, maxPerTon: 6200, currency: 'INR' },
    carbonOffsetFactor: 1.55,
    environmentalBenefit: 'Directly substitutes thermal coal in power plants, avoiding stubble smoke and particulate smog.',
    processingRequirements: ['Moisture < 15%', 'Particle size < 5mm', 'High Lignocellulose content']
  },
  {
    name: 'Biochar & Soil Carbon Sequestration',
    category: 'Biochar & Soil Amendment',
    description: 'Slow pyrolysis (350-600°C in oxygen-limited chambers) producing stable biochar for carbon credits and soil moisture retention.',
    suitableWasteTypes: ['Cotton Stalk', 'Rice Straw', 'Sugarcane Bagasse', 'Groundnut Residue', 'Tomato Residue'],
    minimumQuantityKg: 250,
    estimatedValueRange: { minPerTon: 6500, maxPerTon: 11000, currency: 'INR' },
    carbonOffsetFactor: 2.10,
    environmentalBenefit: 'Permanently locks atmospheric carbon into soil for 100+ years and increases soil CEC by 35%.',
    processingRequirements: ['Moisture < 20%', 'High fixed carbon', 'Low ash fraction']
  },
  {
    name: 'Bio-CNG & Compressed Biogas (CBG)',
    category: 'Biogas & Bio-CNG',
    description: 'Anaerobic digestion converting crop biomass into purified methane (CBG) and organic fermented liquid slurry.',
    suitableWasteTypes: ['Rice Straw', 'Sugarcane Bagasse', 'Maize Residue', 'Tomato Residue'],
    minimumQuantityKg: 500,
    estimatedValueRange: { minPerTon: 3200, maxPerTon: 4800, currency: 'INR' },
    carbonOffsetFactor: 1.70,
    environmentalBenefit: 'Generates green automotive fuel, reducing crude oil import dependency and diesel tailpipe emissions.',
    processingRequirements: ['Pre-treatment for silica/lignin', 'Anaerobic digester feed']
  },
  {
    name: 'Cattle Feed & Nutritive Fodder Pelletizing',
    category: 'Animal Feed / Fodder',
    description: 'Urea-molasses-mineral treatment enhancing crude protein and digestibility for dairy and cattle livestock.',
    suitableWasteTypes: ['Wheat Straw', 'Groundnut Residue', 'Maize Residue'],
    minimumQuantityKg: 150,
    estimatedValueRange: { minPerTon: 4500, maxPerTon: 7500, currency: 'INR' },
    carbonOffsetFactor: 1.25,
    environmentalBenefit: 'Prevents fodder scarcity during dry summer months and eliminates residue burning.',
    processingRequirements: ['Aflatoxin-free', 'Dry storage', 'Fortification with molasses']
  }
];

// @desc    Generate or retrieve AI recommendations for a waste report
// @route   POST /api/recommendations/generate
export const generateRecommendations = async (req, res) => {
  try {
    const { wasteReportId, wasteType, quantity, unit, coordinates } = req.body;

    const normalizedWasteType = wasteType || 'Rice Straw';
    const quantityInKg = (unit === 'tonnes' ? quantity * 1000 : quantity) || 500;

    // Get all pathways
    let pathways = [];
    try {
      pathways = await Pathway.find({ status: 'Active' });
    } catch {
      pathways = inMemoryDB.pathways;
    }
    if (!pathways || pathways.length === 0) {
      pathways = inMemoryDB.pathways.length > 0 ? inMemoryDB.pathways : DEFAULT_PATHWAYS;
    }

    // Calculate transparent multi-factor score for each pathway
    const scoredList = pathways.map(pathway => {
      // 1. Compatibility score (30%)
      const isDirectMatch = pathway.suitableWasteTypes.some(t =>
        t.toLowerCase().includes(normalizedWasteType.toLowerCase()) ||
        normalizedWasteType.toLowerCase().includes(t.toLowerCase())
      );
      const compatScore = isDirectMatch ? 95 : 40;

      // 2. Quantity suitability score (15%)
      const minReq = pathway.minimumQuantityKg || 100;
      const quantityScore = quantityInKg >= minReq ? 92 : Math.max(30, (quantityInKg / minReq) * 80);

      // 3. Processor demand score (20%)
      // Simulated based on industry demand
      let demandScore = 75;
      if (pathway.category.includes('Biomass')) demandScore = 92;
      else if (pathway.category.includes('Compost')) demandScore = 86;
      else if (pathway.category.includes('Biochar')) demandScore = 88;
      else if (pathway.category.includes('Animal Feed')) demandScore = 84;

      // 4. Economic Value score (15%)
      const avgVal = (pathway.estimatedValueRange.minPerTon + pathway.estimatedValueRange.maxPerTon) / 2;
      const econScore = Math.min(98, (avgVal / 10000) * 100);

      // 5. Distance suitability (10%)
      const distScore = 85;

      // 6. Environmental Carbon Score (10%)
      const envScore = Math.min(99, pathway.carbonOffsetFactor * 45);

      // Multi-criteria Weighted Equation:
      const totalScore = (
        (0.30 * compatScore) +
        (0.20 * demandScore) +
        (0.15 * quantityScore) +
        (0.15 * econScore) +
        (0.10 * distScore) +
        (0.10 * envScore)
      );

      const roundedScore = Math.round(totalScore);
      const estimatedValuePerUnit = Math.round(avgVal / 1000); // per kg
      const estimatedValueTotal = Math.round((quantityInKg / 1000) * avgVal);
      const carbonOffsetKg = Math.round(quantityInKg * (pathway.carbonOffsetFactor || 1.2));

      return {
        pathwayId: pathway._id || ('pw_' + pathway.name.toLowerCase().replace(/\s+/g, '_')),
        pathwayName: pathway.name,
        category: pathway.category,
        description: pathway.description,
        score: roundedScore,
        estimatedValueTotal,
        estimatedValuePerUnit,
        carbonOffsetKg,
        scoreFactors: {
          wasteCompatibility: Math.round(compatScore),
          processorDemand: Math.round(demandScore),
          quantitySuitability: Math.round(quantityScore),
          estimatedValue: Math.round(econScore),
          distanceSuitability: Math.round(distScore),
          environmentalScore: Math.round(envScore)
        },
        reasons: [
          `High chemical suitability with ${normalizedWasteType}`,
          `Estimated revenue of ₹${estimatedValueTotal.toLocaleString('en-IN')}`,
          `Avoids ~${carbonOffsetKg} kg CO2e emissions compared to open stubble burning`
        ]
      };
    });

    // Sort descending by highest match score
    scoredList.sort((a, b) => b.score - a.score);

    const recommendationData = {
      wasteReportId: wasteReportId || null,
      farmerId: req.user?._id || 'usr_farmer',
      wasteType: normalizedWasteType,
      quantity: quantityInKg,
      unit: 'kg',
      recommendations: scoredList,
      generatedAt: new Date()
    };

    let recRecord;
    try {
      recRecord = await Recommendation.create(recommendationData);
    } catch {
      recRecord = { ...recommendationData, _id: 'rec_' + Date.now() };
      inMemoryDB.recommendations.unshift(recRecord);
    }

    await logAudit(req, 'RECOMMENDATIONS_GENERATED', 'Recommendation', recRecord._id, {
      wasteType: normalizedWasteType,
      topPathway: scoredList[0]?.pathwayName
    });

    res.json({
      success: true,
      data: recRecord
    });
  } catch (error) {
    console.error('Recommendation generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all configured pathways
// @route   GET /api/recommendations/pathways
export const getPathways = async (req, res) => {
  try {
    let pathways = [];
    try {
      pathways = await Pathway.find();
    } catch {
      pathways = inMemoryDB.pathways;
    }
    if (!pathways || pathways.length === 0) {
      pathways = inMemoryDB.pathways.length > 0 ? inMemoryDB.pathways : DEFAULT_PATHWAYS;
    }
    res.json({ success: true, count: pathways.length, data: pathways });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
