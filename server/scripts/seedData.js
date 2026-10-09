import { inMemoryDB } from '../config/db.js';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import WasteReport from '../models/WasteReport.js';
import Pathway from '../models/Pathway.js';
import Processor from '../models/Processor.js';
import Requirement from '../models/Requirement.js';
import MarketplaceListing from '../models/MarketplaceListing.js';
import Match from '../models/Match.js';
import PickupRequest from '../models/PickupRequest.js';
import Transaction from '../models/Transaction.js';
import AuditLog from '../models/AuditLog.js';
import { DEFAULT_PATHWAYS } from '../controllers/recommendationController.js';

export const populateSeedData = async () => {
  console.log('🌱 Generating and initializing AgriValue AI realistic demonstration data...');

  // 1. Seed Users
  const farmerUser = {
    _id: 'usr_farmer_01',
    name: 'Ramesh Kumar',
    email: 'farmer@agrivalue.ai',
    phone: '+91 98480 12345',
    password: 'agri123',
    role: 'farmer',
    location: {
      address: 'Green Valley Farm, Chityal Road',
      district: 'Nalgonda',
      state: 'Telangana',
      coordinates: { lat: 17.0577, lng: 79.2684 }
    },
    avatar: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 24 * 3600 * 1000)
  };

  const processorUser1 = {
    _id: 'usr_proc_01',
    name: 'Priya Reddy',
    email: 'processor@agrivalue.ai',
    phone: '+91 99887 66554',
    password: 'agri123',
    role: 'processor',
    location: {
      address: 'Plot 42, Cherlapally Industrial Area',
      district: 'Hyderabad',
      state: 'Telangana',
      coordinates: { lat: 17.4589, lng: 78.5992 }
    },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    createdAt: new Date(Date.now() - 120 * 24 * 3600 * 1000)
  };

  const processorUser2 = {
    _id: 'usr_proc_02',
    name: 'Anand Verma',
    email: 'biochar@agrivalue.ai',
    phone: '+91 98220 54321',
    password: 'agri123',
    role: 'processor',
    location: {
      address: 'Bhosari Industrial Estate',
      district: 'Pune',
      state: 'Maharashtra',
      coordinates: { lat: 18.6279, lng: 73.8443 }
    },
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    createdAt: new Date(Date.now() - 80 * 24 * 3600 * 1000)
  };

  const adminUser = {
    _id: 'usr_admin_01',
    name: 'Dr. K. Rao',
    email: 'admin@agrivalue.ai',
    phone: '+91 94400 11223',
    password: 'agri123',
    role: 'admin',
    location: {
      address: 'AgriTech Innovation Hub, Gachibowli',
      district: 'Hyderabad',
      state: 'Telangana',
      coordinates: { lat: 17.4401, lng: 78.3489 }
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    createdAt: new Date(Date.now() - 200 * 24 * 3600 * 1000)
  };

  inMemoryDB.users = [farmerUser, processorUser1, processorUser2, adminUser];

  // 2. Seed Farms
  const farm1 = {
    _id: 'farm_01',
    farmerId: farmerUser._id,
    farmName: 'Green Valley Farm',
    location: {
      address: 'Chityal Mandal, Nalgonda',
      district: 'Nalgonda',
      state: 'Telangana',
      coordinates: { lat: 17.1500, lng: 79.1500 }
    },
    area: 5.5,
    areaUnit: 'acres',
    soilType: 'Black Soil',
    irrigationType: 'Drip Irrigation',
    createdAt: new Date()
  };

  const farm2 = {
    _id: 'farm_02',
    farmerId: farmerUser._id,
    farmName: 'Sunrise Agro Fields',
    location: {
      address: 'Miryalaguda Road, Nalgonda',
      district: 'Nalgonda',
      state: 'Telangana',
      coordinates: { lat: 16.8722, lng: 79.5647 }
    },
    area: 3.2,
    areaUnit: 'acres',
    soilType: 'Red Soil',
    irrigationType: 'Borewell / Tube Well',
    createdAt: new Date()
  };

  inMemoryDB.farms = [farm1, farm2];

  // 3. Seed Crops
  const crop1 = {
    _id: 'crop_01',
    farmerId: farmerUser._id,
    farmId: farm1._id,
    cropName: 'Paddy / Rice (BPT 5204)',
    variety: 'Samba Mahsuri',
    season: 'Kharif (Monsoon)',
    sowingDate: new Date('2026-06-15'),
    harvestDate: new Date('2026-10-20'),
    estimatedProduction: 12,
    productionUnit: 'tonnes',
    status: 'Harvested'
  };

  const crop2 = {
    _id: 'crop_02',
    farmerId: farmerUser._id,
    farmId: farm1._id,
    cropName: 'Bt-Cotton',
    variety: 'Bollgard II Hybrid',
    season: 'Kharif (Monsoon)',
    sowingDate: new Date('2026-07-01'),
    harvestDate: new Date('2026-11-15'),
    estimatedProduction: 6.5,
    productionUnit: 'tonnes',
    status: 'Growing'
  };

  const crop3 = {
    _id: 'crop_03',
    farmerId: farmerUser._id,
    farmId: farm2._id,
    cropName: 'Hybrid Tomato (Abhinav)',
    variety: 'Syngenta 6242',
    season: 'Rabi (Winter)',
    sowingDate: new Date('2026-08-10'),
    harvestDate: new Date('2026-10-05'),
    estimatedProduction: 8.0,
    productionUnit: 'tonnes',
    status: 'Harvested'
  };

  inMemoryDB.crops = [crop1, crop2, crop3];

  // 4. Seed Standard Pathways
  inMemoryDB.pathways = DEFAULT_PATHWAYS.map((p, idx) => ({
    ...p,
    _id: 'pw_0' + (idx + 1),
    status: 'Active'
  }));

  // 5. Seed Processors
  const proc1 = {
    _id: 'proc_01',
    userId: processorUser1._id,
    companyName: 'BioEnergy Renewable Fuels Ltd',
    processorType: 'Biomass Fuel / Briquetting Plant',
    registrationNumber: 'REG-TS-BIO-2023-991',
    gstin: '36AABCB1234F1Z5',
    capacityMonthlyTons: 150,
    location: {
      address: 'Plot 42, Cherlapally Industrial Area, Hyderabad',
      district: 'Hyderabad',
      state: 'Telangana',
      coordinates: { lat: 17.4589, lng: 78.5992 }
    },
    contactPerson: { name: 'Priya Reddy', phone: '+91 99887 66554', email: 'procurement@bioenergyfuels.com' },
    acceptedWasteTypes: ['Rice Straw', 'Cotton Stalk', 'Sugarcane Bagasse', 'Maize Residue'],
    verificationStatus: 'Verified'
  };

  const proc2 = {
    _id: 'proc_02',
    userId: processorUser2._id,
    companyName: 'EcoChar Carbon Sequestration Systems',
    processorType: 'Biochar & Soil Carbon Facility',
    registrationNumber: 'REG-MH-ECO-2024-412',
    gstin: '27AACEA9876E1Z2',
    capacityMonthlyTons: 80,
    location: {
      address: 'Bhosari Industrial Estate, Pune',
      district: 'Pune',
      state: 'Maharashtra',
      coordinates: { lat: 18.6279, lng: 73.8443 }
    },
    contactPerson: { name: 'Anand Verma', phone: '+91 98220 54321', email: 'operations@ecoharcarb.in' },
    acceptedWasteTypes: ['Cotton Stalk', 'Rice Straw', 'Groundnut Residue', 'Tomato Residue'],
    verificationStatus: 'Verified'
  };

  const proc3 = {
    _id: 'proc_03',
    userId: 'usr_proc_03',
    companyName: 'GreenSoil Organics & Composting Ltd',
    processorType: 'Commercial Composting Unit',
    registrationNumber: 'REG-TS-ORG-2022-780',
    gstin: '36AACCO5678G1Z9',
    capacityMonthlyTons: 200,
    location: {
      address: 'Shamirpet Agro Industrial Corridor, Hyderabad',
      district: 'Medchal-Malkajgiri',
      state: 'Telangana',
      coordinates: { lat: 17.5925, lng: 78.5714 }
    },
    contactPerson: { name: 'Vikram Mehta', phone: '+91 98490 87654', email: 'sales@greensoiloragnics.com' },
    acceptedWasteTypes: ['Tomato Residue', 'Vegetable Residue', 'Maize Residue', 'Wheat Straw'],
    verificationStatus: 'Verified'
  };

  inMemoryDB.processors = [proc1, proc2, proc3];

  // 6. Seed Requirements
  inMemoryDB.requirements = [
    {
      _id: 'req_01',
      processorId: proc1._id,
      userId: processorUser1._id,
      title: 'Immediate Requirement: 50 Tonnes Rice Straw / Cotton Stalks',
      wasteTypes: ['Rice Straw', 'Cotton Stalk'],
      targetQuantity: 50,
      fulfilledQuantity: 24.5,
      unit: 'tonnes',
      offeredPricePerUnit: 5200,
      maxProcurementDistanceKm: 120,
      preferredMoisture: 'Low (< 15%)',
      deadlineDate: new Date('2026-11-30'),
      status: 'Open',
      notes: 'Baled or bundled straw preferred. Immediate payment upon weighbridge verification.'
    },
    {
      _id: 'req_02',
      processorId: proc3._id,
      userId: 'usr_proc_03',
      title: 'Bulk Organic Composting Biomass Procurement',
      wasteTypes: ['Tomato Residue', 'Vegetable Residue', 'Maize Residue'],
      targetQuantity: 30,
      fulfilledQuantity: 12,
      unit: 'tonnes',
      offeredPricePerUnit: 2800,
      maxProcurementDistanceKm: 80,
      deadlineDate: new Date('2026-11-15'),
      status: 'Open',
      notes: 'High organic matter moisture acceptable.'
    }
  ];

  // 7. Seed Waste Reports
  inMemoryDB.wasteReports = [
    {
      _id: 'waste_01',
      farmerId: farmerUser._id,
      farmId: farm1._id,
      cropId: crop1._id,
      crop: 'Paddy / Rice',
      wasteType: 'Rice Straw',
      quantity: 2500,
      unit: 'kg',
      moistureContent: 'Low (< 15%)',
      storageCondition: 'Field Stacked',
      location: farm1.location,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
      aiAnalysis: {
        predictedClass: 'Rice Straw',
        confidence: 0.942,
        topPredictions: [
          { className: 'Rice Straw', confidence: 0.942 },
          { className: 'Wheat Straw', confidence: 0.041 },
          { className: 'Maize Residue', confidence: 0.017 }
        ],
        inferenceTimeMs: 46
      },
      status: 'Listed',
      availabilityDate: new Date()
    },
    {
      _id: 'waste_02',
      farmerId: farmerUser._id,
      farmId: farm1._id,
      cropId: crop2._id,
      crop: 'Bt-Cotton',
      wasteType: 'Cotton Stalk',
      quantity: 1800,
      unit: 'kg',
      moistureContent: 'Medium (15-30%)',
      storageCondition: 'Covered Shed',
      location: farm1.location,
      image: 'https://images.unsplash.com/photo-1594488500277-2b369c3a373b?auto=format&fit=crop&w=600&q=80',
      aiAnalysis: {
        predictedClass: 'Cotton Stalk',
        confidence: 0.895,
        topPredictions: [
          { className: 'Cotton Stalk', confidence: 0.895 },
          { className: 'Groundnut Residue', confidence: 0.072 },
          { className: 'Sugarcane Bagasse', confidence: 0.033 }
        ],
        inferenceTimeMs: 41
      },
      status: 'Listed',
      availabilityDate: new Date()
    },
    {
      _id: 'waste_03',
      farmerId: farmerUser._id,
      farmId: farm2._id,
      cropId: crop3._id,
      crop: 'Tomato',
      wasteType: 'Tomato Residue',
      quantity: 800,
      unit: 'kg',
      moistureContent: 'High (> 30%)',
      storageCondition: 'Loose in Open',
      location: farm2.location,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      aiAnalysis: {
        predictedClass: 'Tomato Residue',
        confidence: 0.934,
        topPredictions: [
          { className: 'Tomato Residue', confidence: 0.934 },
          { className: 'Vegetable Biomass', confidence: 0.052 },
          { className: 'Compost Mix', confidence: 0.014 }
        ],
        inferenceTimeMs: 38
      },
      status: 'Listed',
      availabilityDate: new Date()
    }
  ];

  // 8. Seed Marketplace Listings
  inMemoryDB.marketplaceListings = [
    {
      _id: 'list_01',
      farmerId: farmerUser._id,
      farmer: farmerUser,
      wasteReportId: 'waste_01',
      title: 'Premium Sun-Dried Rice Straw Bales (2.5 Tonnes)',
      crop: 'Paddy / Rice',
      wasteType: 'Rice Straw',
      quantity: 2.5,
      unit: 'tonnes',
      expectedPrice: 12000,
      isNegotiable: true,
      location: {
        address: 'Green Valley Farm, Nalgonda',
        district: 'Nalgonda',
        state: 'Telangana',
        coordinates: { lat: 17.0577, lng: 79.2684 }
      },
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
      aiVerified: true,
      aiConfidence: 0.942,
      recommendedPathways: [
        { pathwayName: 'Biomass Fuel & Briquetting', score: 96 },
        { pathwayName: 'Biochar & Carbon Soil', score: 88 }
      ],
      status: 'Available',
      viewsCount: 48,
      inquiriesCount: 5,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000)
    },
    {
      _id: 'list_02',
      farmerId: farmerUser._id,
      farmer: farmerUser,
      wasteReportId: 'waste_02',
      title: 'High Calorific Cotton Stalk Residue (1.8 Tonnes)',
      crop: 'Bt-Cotton',
      wasteType: 'Cotton Stalk',
      quantity: 1.8,
      unit: 'tonnes',
      expectedPrice: 9500,
      isNegotiable: true,
      location: {
        address: 'Green Valley Farm, Nalgonda',
        district: 'Nalgonda',
        state: 'Telangana',
        coordinates: { lat: 17.0577, lng: 79.2684 }
      },
      image: 'https://images.unsplash.com/photo-1594488500277-2b369c3a373b?auto=format&fit=crop&w=600&q=80',
      aiVerified: true,
      aiConfidence: 0.895,
      recommendedPathways: [
        { pathwayName: 'Biochar Production', score: 92 },
        { pathwayName: 'Biomass Briquettes', score: 89 }
      ],
      status: 'Available',
      viewsCount: 32,
      inquiriesCount: 3,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000)
    },
    {
      _id: 'list_03',
      farmerId: farmerUser._id,
      farmer: farmerUser,
      wasteReportId: 'waste_03',
      title: 'Fresh Tomato Crop Residue & Vines (800 kg)',
      crop: 'Tomato',
      wasteType: 'Tomato Residue',
      quantity: 800,
      unit: 'kg',
      expectedPrice: 4200,
      isNegotiable: false,
      location: {
        address: 'Sunrise Agro Fields, Nalgonda',
        district: 'Nalgonda',
        state: 'Telangana',
        coordinates: { lat: 16.8722, lng: 79.5647 }
      },
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      aiVerified: true,
      aiConfidence: 0.934,
      recommendedPathways: [
        { pathwayName: 'Commercial Composting', score: 89 },
        { pathwayName: 'Bio-CNG Feedstock', score: 82 }
      ],
      status: 'Available',
      viewsCount: 19,
      inquiriesCount: 2,
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000)
    }
  ];

  // 9. Seed Matches
  inMemoryDB.matches = [
    {
      _id: 'match_01',
      listingId: inMemoryDB.marketplaceListings[0]._id,
      listing: inMemoryDB.marketplaceListings[0],
      farmerId: farmerUser._id,
      farmer: farmerUser,
      processorId: proc1._id,
      processor: proc1,
      matchScore: 96,
      distanceKm: 18.2,
      matchedFactors: {
        wasteCompatibility: 98,
        distanceSuitability: 94,
        quantitySuitability: 96,
        priceCompatibility: 95
      },
      status: 'Accepted',
      initiatorRole: 'processor',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000)
    },
    {
      _id: 'match_02',
      listingId: inMemoryDB.marketplaceListings[1]._id,
      listing: inMemoryDB.marketplaceListings[1],
      farmerId: farmerUser._id,
      farmer: farmerUser,
      processorId: proc2._id,
      processor: proc2,
      matchScore: 92,
      distanceKm: 24.5,
      matchedFactors: {
        wasteCompatibility: 96,
        distanceSuitability: 88,
        quantitySuitability: 92,
        priceCompatibility: 90
      },
      status: 'Suggested',
      initiatorRole: 'system',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000)
    }
  ];

  // 10. Seed Pickup Requests
  inMemoryDB.pickupRequests = [
    {
      _id: 'pick_01',
      matchId: 'match_01',
      listingId: inMemoryDB.marketplaceListings[0]._id,
      listing: inMemoryDB.marketplaceListings[0],
      farmerId: farmerUser._id,
      farmer: farmerUser,
      processorId: proc1._id,
      processor: proc1,
      pickupLocation: inMemoryDB.marketplaceListings[0].location,
      destinationLocation: proc1.location,
      scheduledDate: new Date(Date.now() + 24 * 3600 * 1000),
      wasteType: 'Rice Straw',
      quantity: 2.5,
      unit: 'tonnes',
      agreedPrice: 12000,
      driverDetails: {
        driverName: 'Sunil Kumar (Logistics Partner)',
        driverPhone: '+91 94401 98765',
        vehicleNumber: 'TS 08 UB 4512',
        vehicleType: 'Eicher 14-Ft Flatbed'
      },
      status: 'Scheduled',
      statusHistory: [
        { status: 'Requested', timestamp: new Date(Date.now() - 48 * 3600 * 1000), notes: 'Processor initiated pickup request' },
        { status: 'Accepted', timestamp: new Date(Date.now() - 36 * 3600 * 1000), notes: 'Farmer accepted pickup timing' },
        { status: 'Scheduled', timestamp: new Date(Date.now() - 12 * 3600 * 1000), notes: 'Vehicle assigned and route confirmed' }
      ],
      notes: 'Please load from eastern farm gate near tube well.'
    }
  ];

  // 11. Seed Audit Logs
  inMemoryDB.auditLogs = [
    {
      _id: 'audit_01',
      userId: adminUser._id,
      userRole: 'admin',
      userName: 'Dr. K. Rao',
      action: 'PROCESSOR_KYC_VERIFIED',
      entity: 'Processor',
      entityId: proc1._id,
      details: { companyName: proc1.companyName },
      ipAddress: '192.168.1.101',
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000)
    },
    {
      _id: 'audit_02',
      userId: farmerUser._id,
      userRole: 'farmer',
      userName: 'Ramesh Kumar',
      action: 'AI_WASTE_CLASSIFICATION',
      entity: 'WasteReport',
      entityId: 'waste_01',
      details: { detectedClass: 'Rice Straw', confidence: 0.942 },
      ipAddress: '192.168.1.145',
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000)
    },
    {
      _id: 'audit_03',
      userId: processorUser1._id,
      userRole: 'processor',
      userName: 'Priya Reddy',
      action: 'PICKUP_SCHEDULED',
      entity: 'PickupRequest',
      entityId: 'pick_01',
      details: { scheduledDate: new Date(), agreedPrice: 12000 },
      ipAddress: '192.168.1.210',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000)
    }
  ];

  console.log(`✅ Pre-seeded ${inMemoryDB.users.length} Users, ${inMemoryDB.farms.length} Farms, ${inMemoryDB.crops.length} Crops, ${inMemoryDB.wasteReports.length} Waste Reports, ${inMemoryDB.marketplaceListings.length} Listings, ${inMemoryDB.pickupRequests.length} Pickups.`);
};
