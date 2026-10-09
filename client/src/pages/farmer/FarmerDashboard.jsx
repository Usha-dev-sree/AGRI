import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, wasteAPI } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  Scale,
  IndianRupee,
  Store,
  CheckCircle2,
  ScanLine,
  PlusCircle,
  Truck,
  Leaf,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getDashboardAnalytics();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Using local analytics dataset');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const pieData = data?.wasteByCrop || [
    { name: 'Rice Straw', value: 2160, percentage: 45, color: '#10b981' },
    { name: 'Cotton Stalk', value: 1440, percentage: 30, color: '#3b82f6' },
    { name: 'Tomato Residue', value: 1200, percentage: 25, color: '#06b6d4' }
  ];

  const trendData = data?.monthlyTrend || [
    { month: 'May', wasteTons: 1.2, valueEarned: 9600 },
    { month: 'Jun', wasteTons: 1.8, valueEarned: 14200 },
    { month: 'Jul', wasteTons: 2.1, valueEarned: 18500 },
    { month: 'Aug', wasteTons: 3.4, valueEarned: 29000 },
    { month: 'Sep', wasteTons: 4.1, valueEarned: 36800 },
    { month: 'Oct', wasteTons: 4.8, valueEarned: 42500 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-slate-950/90 border border-emerald-500/25">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="emerald">🌾 Farmer Portal</Badge>
              <Badge variant="cyan">📍 Nalgonda, Telangana</Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-2">
              Welcome back, {user?.name || 'Ramesh Kumar'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Monetize your agricultural residue through AI classification, instant processor matching, and zero stubble burning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/farmer/ai-scanner"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all"
            >
              <ScanLine className="w-4 h-4" />
              Scan Waste with AI
            </Link>
            <Link
              to="/farmer/waste"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 text-white font-semibold text-xs border border-white/10 hover:border-emerald-500/30 flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Log Waste
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Waste Reported"
          value={data?.summary?.totalWasteReportedTonnes || '4.8'}
          unit="Tonnes"
          icon={Scale}
          trend="up"
          trendValue="18.5%"
          color="emerald"
        />
        <StatCard
          title="Potential Value Unlocked"
          value={`₹${(data?.summary?.totalPotentialValueINR || 42500).toLocaleString('en-IN')}`}
          subtitle="Estimated monetization realization"
          icon={IndianRupee}
          trend="up"
          trendValue="₹14,200"
          color="cyan"
        />
        <StatCard
          title="Active Marketplace Listings"
          value={data?.summary?.activeListings || '3'}
          subtitle="2 inquiries from bio-refineries"
          icon={Store}
          color="blue"
        />
        <StatCard
          title="Completed Pickups"
          value={data?.summary?.completedPickups || '12'}
          subtitle="100% On-time logistics"
          icon={CheckCircle2}
          color="amber"
        />
      </div>

      {/* Main Content Split (Charts & Live Tracking & Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Waste by Crop Donut Chart */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" /> Waste by Crop Type
            </h3>
            <span className="text-[10px] text-slate-400">Current Season</span>
          </div>

          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1612', borderColor: '#10b981', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white">4.8 T</span>
              <span className="text-[10px] text-slate-400">Total Residue</span>
            </div>
          </div>

          <div className="space-y-2 mt-3 pt-3 border-t border-white/5 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-white">{(item.value / 1000).toFixed(2)} T ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Live Pickup Tracking Timeline */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" /> Live Pickup Tracking
              </h3>
              <Badge variant="cyan">Active Request</Badge>
            </div>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/30">
              <div className="relative pl-8">
                <div className="absolute left-1.5 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xs font-bold text-white">Pickup Confirmed & Truck Scheduled</h4>
                  <span className="text-[10px] text-slate-400">Today, 11:45 AM</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Driver: <span className="text-emerald-300 font-semibold">Sunil K. (TS 08 UB 4512)</span>
                </p>
                <p className="text-[10px] text-slate-400">Destination: BioEnergy Renewable Fuels Ltd (18.2 km)</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-1.5 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xs font-bold text-white">Marketplace Listing #W394 Verified</h4>
                  <span className="text-[10px] text-slate-400">Oct 27, 09:15 AM</span>
                </div>
                <p className="text-[11px] text-slate-400">2.5 Tonnes Sun-Dried Rice Straw</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-1.5 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xs font-bold text-white">AI Visual Waste Analysis Completed</h4>
                  <span className="text-[10px] text-slate-400">Oct 26, 04:30 PM</span>
                </div>
                <p className="text-[11px] text-slate-400">MobileNetV3 Classified (94.2% Confidence)</p>
              </div>
            </div>
          </div>

          <Link
            to="/farmer/pickups"
            className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
          >
            <span>View Full Logistics History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right Column: Quick Action Cards */}
        <div className="lg:col-span-3 space-y-3">
          <Link
            to="/farmer/ai-scanner"
            className="block p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-bold text-xs group hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <ScanLine className="w-5 h-5" />
              <span className="text-sm">Scan Waste with AI</span>
            </div>
            <p className="text-[11px] font-medium opacity-90">Upload residue photos for instant classification & valuation</p>
          </Link>

          <Link
            to="/farmer/waste"
            className="block p-4 rounded-2xl glass-card border-emerald-500/30 text-white font-bold text-xs group hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-2 mb-1 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
              <span className="text-sm">New Waste Listing</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">Publish harvested residue directly to verified buyers</p>
          </Link>

          <Link
            to="/farmer/pickups"
            className="block p-4 rounded-2xl glass-card border-cyan-500/30 text-white font-bold text-xs group hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-2 mb-1 text-cyan-400">
              <Truck className="w-5 h-5" />
              <span className="text-sm">Schedule Pickup</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">Track driver dispatch and weighbridge settlement</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
