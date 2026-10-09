import User from '../models/User.js';
import WasteReport from '../models/WasteReport.js';
import MarketplaceListing from '../models/MarketplaceListing.js';
import PickupRequest from '../models/PickupRequest.js';
import Transaction from '../models/Transaction.js';
import Processor from '../models/Processor.js';
import AuditLog from '../models/AuditLog.js';
import { inMemoryDB } from '../config/db.js';

// @desc    Get dashboard analytics tailored to user's role (Farmer, Processor, or Admin)
// @route   GET /api/analytics/dashboard
export const getDashboardAnalytics = async (req, res) => {
  try {
    const role = req.user?.role || 'farmer';
    const userId = req.user?._id;

    if (role === 'farmer') {
      const userReports = inMemoryDB.wasteReports.filter(w => w.farmerId?.toString() === userId?.toString());
      const userListings = inMemoryDB.marketplaceListings.filter(l => l.farmerId?.toString() === userId?.toString());
      const userPickups = inMemoryDB.pickupRequests.filter(p => p.farmerId?.toString() === userId?.toString());

      const totalWasteKg = userReports.reduce((sum, r) => sum + (r.unit === 'tonnes' ? r.quantity * 1000 : r.quantity), 0) || 4800;
      const totalValueINR = userListings.reduce((sum, l) => sum + l.expectedPrice, 0) || 42500;
      const activeListingsCount = userListings.filter(l => l.status === 'Available').length || 3;
      const completedPickupsCount = userPickups.filter(p => p.status === 'Completed').length || 12;
      const carbonOffsetKg = Math.round(totalWasteKg * 1.45);

      const wasteByCrop = [
        { name: 'Rice Straw', value: 2160, percentage: 45, color: '#10b981' },
        { name: 'Cotton Stalk', value: 1440, percentage: 30, color: '#3b82f6' },
        { name: 'Tomato Residue', value: 1200, percentage: 25, color: '#06b6d4' }
      ];

      const monthlyTrend = [
        { month: 'May', wasteTons: 1.2, valueEarned: 9600 },
        { month: 'Jun', wasteTons: 1.8, valueEarned: 14200 },
        { month: 'Jul', wasteTons: 2.1, valueEarned: 18500 },
        { month: 'Aug', wasteTons: 3.4, valueEarned: 29000 },
        { month: 'Sep', wasteTons: 4.1, valueEarned: 36800 },
        { month: 'Oct', wasteTons: 4.8, valueEarned: 42500 }
      ];

      return res.json({
        success: true,
        data: {
          role: 'farmer',
          summary: {
            totalWasteReportedTonnes: (totalWasteKg / 1000).toFixed(1),
            totalPotentialValueINR: totalValueINR,
            activeListings: activeListingsCount,
            completedPickups: completedPickupsCount,
            carbonOffsetTons: (carbonOffsetKg / 1000).toFixed(1)
          },
          wasteByCrop,
          monthlyTrend,
          recentPickups: userPickups.slice(0, 4)
        }
      });
    }

    if (role === 'processor') {
      const allListings = inMemoryDB.marketplaceListings;
      const allPickups = inMemoryDB.pickupRequests;

      return res.json({
        success: true,
        data: {
          role: 'processor',
          summary: {
            totalProcuredTons: 18.5,
            activeOrders: 4,
            procurementCostINR: 142000,
            carbonDivertedTons: 26.8
          },
          demandFulfillment: [
            { category: 'Biomass Briquettes', target: 25, fulfilled: 18.5, percent: 74 },
            { category: 'Biochar Pyrolysis', target: 15, fulfilled: 11.2, percent: 75 },
            { category: 'Bio-CNG Feedstock', target: 30, fulfilled: 22.0, percent: 73 }
          ],
          availableMarketSupply: allListings.slice(0, 5),
          activePickups: allPickups.slice(0, 4)
        }
      });
    }

    // Role === 'admin'
    const totalFarmers = inMemoryDB.users.filter(u => u.role === 'farmer').length || 1420;
    const totalProcessors = inMemoryDB.users.filter(u => u.role === 'processor').length || 84;
    const totalWasteTonnes = 342.5;
    const totalCarbonOffsetTonnes = 418.2;
    const platformEconomicValue = 3845000;

    const wasteCategoryDistribution = [
      { name: 'Rice Straw (Paddy)', tonnes: 145, percentage: 42, color: '#10b981' },
      { name: 'Cotton Stalk', tonnes: 85, percentage: 25, color: '#3b82f6' },
      { name: 'Sugarcane Bagasse', tonnes: 55, percentage: 16, color: '#8b5cf6' },
      { name: 'Maize & Corn Residue', tonnes: 35, percentage: 10, color: '#f59e0b' },
      { name: 'Horticultural Biomass', tonnes: 22.5, percentage: 7, color: '#ef4444' }
    ];

    const monthlyPlatformGrowth = [
      { month: 'May', recovered: 120, monetized: 80, carbonAvoided: 140 },
      { month: 'Jun', recovered: 180, monetized: 135, carbonAvoided: 210 },
      { month: 'Jul', recovered: 230, monetized: 185, carbonAvoided: 275 },
      { month: 'Aug', recovered: 290, monetized: 230, carbonAvoided: 350 },
      { month: 'Sep', recovered: 320, monetized: 280, carbonAvoided: 390 },
      { month: 'Oct', recovered: 342, monetized: 310, carbonAvoided: 418 }
    ];

    const regionalStateDistribution = [
      { state: 'Telangana', count: 520, volumeTonnes: 128 },
      { state: 'Andhra Pradesh', count: 390, volumeTonnes: 94 },
      { state: 'Maharashtra', count: 280, volumeTonnes: 72 },
      { state: 'Punjab & Haryana', count: 230, volumeTonnes: 48 }
    ];

    return res.json({
      success: true,
      data: {
        role: 'admin',
        summary: {
          totalFarmers,
          totalProcessors,
          totalWasteDivertedTonnes: totalWasteTonnes,
          totalCarbonOffsetTonnes,
          platformEconomicValueINR: platformEconomicValue,
          activeListingsCount: inMemoryDB.marketplaceListings.length || 24,
          completedPickupsCount: 88
        },
        wasteCategoryDistribution,
        monthlyPlatformGrowth,
        regionalStateDistribution,
        pendingKYCQueue: inMemoryDB.processors.filter(p => p.verificationStatus === 'Pending Verification'),
        recentAuditLogs: inMemoryDB.auditLogs.slice(0, 6)
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
