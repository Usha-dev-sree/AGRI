import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import {
  Leaf,
  ScanLine,
  Sparkles,
  Store,
  Truck,
  ShieldCheck,
  Flame,
  Scale,
  IndianRupee,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const handleLaunchRole = () => {
    navigate('/login');
  };

  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-4 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>B.Tech Major Project Edition • MERN + Python FastAPI Microservice</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Transforming Agricultural Waste into{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Economic & Environmental Value
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An AI-powered circular bio-economy platform eliminating open-field stubble burning by connecting farmers with bio-energy refineries, composting plants, and biochar facilities.
        </p>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => handleLaunchRole('farmer')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
          >
            <span>Launch Farmer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleLaunchRole('processor')}
            className="px-6 py-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950/40 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <span>Explore Processor Marketplace</span>
            <Store className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleLaunchRole('admin')}
            className="px-6 py-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-950/40 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <span>Executive Admin Portal</span>
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Real-time Environmental & Economic Impact Counters */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl text-center border-emerald-500/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-black text-white">342+</h3>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Tonnes Biomass Diverted</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl text-center border-cyan-500/20">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-2">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-black text-white">418 T</h3>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Avoided CO2e Emissions</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl text-center border-amber-500/20">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-2">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-black text-white">₹38.4 L</h3>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Farmer Value Unlocked</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl text-center border-purple-500/20">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-black text-white">1,500+</h3>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Connected Stakeholders</p>
        </div>
      </section>

      {/* 3 User Role Deep-Dive Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="cyan">3 Core Stakeholders</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Built for the Complete Agricultural Value Chain</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Farmer Card */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/25 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">👨🌾 Farmer Portal</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Log post-harvest residues, scan photos using MobileNetV3 AI for instant classification, obtain Waste-to-Value pathway recommendations, and list supply on the open market.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">✓ AI Visual Scanner with Top-3 Confidence</li>
                <li className="flex items-center gap-2">✓ Farm & Soil Classification Profiles</li>
                <li className="flex items-center gap-2">✓ 6-Stage Pickup Logistics Tracker</li>
              </ul>
            </div>
            <button
              onClick={() => handleLaunchRole('farmer')}
              className="mt-6 w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              Enter Farmer Dashboard &rarr;
            </button>
          </div>

          {/* Processor Card */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col justify-between hover:border-cyan-500/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">🏭 Processor / Buyer Hub</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Source reliable feedstock for biomass briquettes, biochar, bio-CNG, and cattle feed. Leverage Haversine distance matching and dispatch fleet logistics directly.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">✓ Distance & Moisture Filter Sliders</li>
                <li className="flex items-center gap-2">✓ Post Procurement Demand RFPs</li>
                <li className="flex items-center gap-2">✓ Automated Weighbridge Verification</li>
              </ul>
            </div>
            <button
              onClick={() => handleLaunchRole('processor')}
              className="mt-6 w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              Enter Processor Portal &rarr;
            </button>
          </div>

          {/* Admin Card */}
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/25 flex flex-col justify-between hover:border-purple-500/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">👨💼 Admin Governance</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Oversee platform compliance, verify processor business KYC credentials, calibrate scientific conversion matrices, and generate national ESG carbon offset reports.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">✓ Multi-Series ESG Diversion Analytics</li>
                <li className="flex items-center gap-2">✓ State & District Heatmap Metrics</li>
                <li className="flex items-center gap-2">✓ Immutable Real-time Audit Trail</li>
              </ul>
            </div>
            <button
              onClick={() => handleLaunchRole('admin')}
              className="mt-6 w-full py-2.5 rounded-xl bg-purple-500 text-white font-bold text-xs hover:bg-purple-400 transition-colors"
            >
              Enter Admin Portal &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
