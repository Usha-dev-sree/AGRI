import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, marketplaceAPI } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  Building2,
  Scale,
  IndianRupee,
  Truck,
  Leaf,
  Store,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const ProcessorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, mRes] = await Promise.all([
          analyticsAPI.getDashboardAnalytics(),
          marketplaceAPI.getListings()
        ]);
        if (aRes.success) setData(aRes.data);
        if (mRes.success) setRecentListings(mRes.data.slice(0, 3));
      } catch (e) {
        console.warn('Error loading processor dashboard');
      }
    };
    load();
  }, []);

  const barData = data?.demandFulfillment || [
    { category: 'Biomass Briquettes', target: 25, fulfilled: 18.5, percent: 74 },
    { category: 'Biochar Pyrolysis', target: 15, fulfilled: 11.2, percent: 75 },
    { category: 'Bio-CNG Feedstock', target: 30, fulfilled: 22.0, percent: 73 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-slate-950/90 border border-cyan-500/25">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan">🏭 Processor & Buyer Hub</Badge>
              <Badge variant="emerald"><ShieldCheck className="w-3 h-3" /> Verified Bio-Refinery</Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-2">
              {user?.name || 'Priya Reddy (BioEnergy Renewable Fuels Ltd)'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Source verified agricultural biomass, match with local farm parcels, and manage automated dispatch logistics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/processor/marketplace"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all"
            >
              <Store className="w-4 h-4" />
              Browse Waste Marketplace
            </Link>
            <Link
              to="/processor/requirements"
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs border border-white/10 hover:border-cyan-500/30 flex items-center gap-2 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              Post Procurement RFP
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Biomass Procured"
          value={data?.summary?.totalProcuredTons || '18.5'}
          unit="Tonnes"
          icon={Scale}
          trend="up"
          trendValue="24%"
          color="cyan"
        />
        <StatCard
          title="Active Procurement Orders"
          value={data?.summary?.activeOrders || '4'}
          subtitle="3 in scheduled logistics"
          icon={Truck}
          color="emerald"
        />
        <StatCard
          title="Procurement Investment"
          value={`₹${(data?.summary?.procurementCostINR || 142000).toLocaleString('en-IN')}`}
          subtitle="Average ₹4,800/Ton"
          icon={IndianRupee}
          color="blue"
        />
        <StatCard
          title="Carbon Averted from Burning"
          value={data?.summary?.carbonDivertedTons || '26.8'}
          unit="Tons CO2e"
          icon={Leaf}
          color="purple"
        />
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Demand Fulfillment Progress */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" /> Seasonal Feedstock Procurement Targets
              </h3>
              <span className="text-[10px] text-slate-400">Monthly Capacity</span>
            </div>

            <div className="space-y-4">
              {barData.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-semibold">{item.category}</span>
                    <span className="text-cyan-400 font-bold">{item.fulfilled} / {item.target} Tons ({item.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Plant Location: Cherlapally Hub, Hyderabad</span>
            <span className="text-cyan-400 font-semibold">150 T/Month Capacity</span>
          </div>
        </div>

        {/* Right: Available Marketplace Matches */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" /> Fresh Agricultural Residue Feeds
              </h3>
              <Link to="/processor/marketplace" className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentListings.map((item) => (
                <div key={item._id} className="p-3 rounded-xl glass-card border border-emerald-500/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.wasteType} ({item.quantity} {item.unit})</h4>
                      <p className="text-[11px] text-slate-400">{item.location?.district}, {item.location?.state}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400">₹{item.expectedPrice?.toLocaleString('en-IN')}</p>
                    <Link
                      to="/processor/marketplace"
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300"
                    >
                      Inspect Feed &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/processor/pickups"
            className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-semibold hover:text-cyan-300"
          >
            <span>Manage Assigned Transporters & Driver Routes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
