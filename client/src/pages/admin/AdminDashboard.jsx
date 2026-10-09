import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  ShieldAlert,
  Users,
  Building2,
  Leaf,
  Scale,
  IndianRupee,
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await analyticsAPI.getDashboardAnalytics();
        if (res.success) setData(res.data);
      } catch (e) {
        console.warn('Error loading admin analytics');
      }
    };
    load();
  }, []);

  const lineData = data?.monthlyPlatformGrowth || [
    { month: 'May', recovered: 120, monetized: 80, carbonAvoided: 140 },
    { month: 'Jun', recovered: 180, monetized: 135, carbonAvoided: 210 },
    { month: 'Jul', recovered: 230, monetized: 185, carbonAvoided: 275 },
    { month: 'Aug', recovered: 290, monetized: 230, carbonAvoided: 350 },
    { month: 'Sep', recovered: 320, monetized: 280, carbonAvoided: 390 },
    { month: 'Oct', recovered: 342, monetized: 310, carbonAvoided: 418 }
  ];

  const stateData = data?.regionalStateDistribution || [
    { state: 'Telangana', volumeTonnes: 128 },
    { state: 'Andhra Pradesh', volumeTonnes: 94 },
    { state: 'Maharashtra', volumeTonnes: 72 },
    { state: 'Punjab & Haryana', volumeTonnes: 48 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-slate-950/90 border border-purple-500/25">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple">👨💼 Executive Admin Governance</Badge>
              <Badge variant="emerald"><Activity className="w-3 h-3" /> System Health 100%</Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-2">
              Platform Overview & ESG Carbon Impact
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Cross-state crop residue recovery monitoring, processor compliance governance, and carbon offset accounting.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/90 border border-purple-500/30 px-3.5 py-2 rounded-xl text-purple-300">
            <span>UPTIME: 99.98%</span>
            <span>•</span>
            <span>NODES: 3 (MERN + AI)</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Registered Farmers"
          value={data?.summary?.totalFarmers || '1,420'}
          icon={Users}
          trend="up"
          trendValue="12.4%"
          color="emerald"
        />
        <StatCard
          title="Verified Processors"
          value={data?.summary?.totalProcessors || '84'}
          icon={Building2}
          color="cyan"
        />
        <StatCard
          title="Waste Diverted from Burning"
          value={data?.summary?.totalWasteDivertedTonnes || '342.5'}
          unit="Tonnes"
          icon={Scale}
          trend="up"
          trendValue="38 Tonnes"
          color="amber"
        />
        <StatCard
          title="Carbon Offset Total"
          value={data?.summary?.totalCarbonOffsetTonnes || '418.2'}
          unit="Tons CO2e"
          icon={Leaf}
          color="purple"
        />
        <StatCard
          title="Platform Economic Value"
          value={`₹${((data?.summary?.platformEconomicValueINR || 3845000) / 100000).toFixed(1)}L`}
          subtitle="Monetized revenue"
          icon={IndianRupee}
          color="blue"
        />
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Multi-series Line Chart */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Monthly Crop Waste Diverted vs. Monetized
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Tracking biomass diversion from open-field burning</p>
            </div>
            <span className="text-[10px] text-slate-400">Tonnes / Month</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1612', borderColor: '#10b981', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="recovered" name="Residue Recovered (T)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="monetized" name="Biomass Monetized (T)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="carbonAvoided" name="CO2e Avoided (T)" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: State Distribution */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" /> Regional Recovery
              </h3>
              <span className="text-[10px] text-slate-400">State Breakdown</span>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateData} layout="vertical">
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis type="category" dataKey="state" stroke="#64748b" fontSize={10} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0d1612', borderColor: '#a855f7', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="volumeTonnes" name="Volume (T)" fill="#a855f7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Hub: Southern Agro-Corridor</span>
            <span className="text-purple-300 font-semibold">4 States Covered</span>
          </div>
        </div>
      </div>

      {/* KYC Verification Queue & Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KYC Queue */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" /> Pending Processor KYC Verification Queue
            </h3>
            <Badge variant="amber">2 Awaiting Review</Badge>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl glass-card border border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">GreenSoil Organics & Composting Ltd</h4>
                <p className="text-[11px] text-slate-400">Shamirpet, Medchal • Reg: #TS-ORG-2022</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30">
                  Approve
                </button>
                <button className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs hover:bg-slate-700">
                  Inspect
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl glass-card border border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Punjab Biochar & Energy Synthetics</h4>
                <p className="text-[11px] text-slate-400">Ludhiana Industrial Hub • Reg: #PB-BIO-2024</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30">
                  Approve
                </button>
                <button className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs hover:bg-slate-700">
                  Inspect
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Stream */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" /> Real-time System Audit Stream
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">LIVE TRAIL</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">PROCESSOR_KYC_VERIFIED</span>
                <p className="text-[10px] text-slate-400">Actor: Dr. K. Rao (Admin) • Entity: BioEnergy Ltd</p>
              </div>
              <span className="text-[10px] text-slate-500">12 min ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-400">AI_WASTE_CLASSIFICATION</span>
                <p className="text-[10px] text-slate-400">Actor: Ramesh Kumar • Detected: Rice Straw (94.2%)</p>
              </div>
              <span className="text-[10px] text-slate-500">25 min ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-cyan-400">PICKUP_SCHEDULED</span>
                <p className="text-[10px] text-slate-400">Actor: Priya Reddy • Transporter TS 08 UB 4512</p>
              </div>
              <span className="text-[10px] text-slate-500">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
