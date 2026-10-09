import React, { useState, useEffect } from 'react';
import { aiAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Layers, Plus, Sparkles, Leaf, Flame, ShieldAlert } from 'lucide-react';

export const PathwayManager = () => {
  const [pathways, setPathways] = useState([]);

  useEffect(() => {
    loadPathways();
  }, []);

  const loadPathways = async () => {
    try {
      const res = await aiAPI.getPathways();
      if (res.success) setPathways(res.data);
    } catch (e) {
      console.warn('Error loading pathways');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">AI Knowledge Graph</Badge>
            <Badge variant="emerald">{pathways.length} Active Value Pathways</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" />
            Waste-to-Value Pathways & Carbon Factor Configuration
          </h1>
          <p className="text-xs text-slate-300">
            Define scientific conversion methodologies, standard price thresholds (₹/Ton), and carbon offset calculation coefficients.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pathways.map((pw) => (
          <div key={pw._id || pw.name} className="glass-panel p-5 rounded-2xl border border-purple-500/20 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="purple">{pw.category}</Badge>
                <h3 className="text-base font-bold text-white mt-2">{pw.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Value Range</span>
                <p className="text-sm font-extrabold text-emerald-400">
                  ₹{pw.estimatedValueRange?.minPerTon?.toLocaleString('en-IN')} - ₹{pw.estimatedValueRange?.maxPerTon?.toLocaleString('en-IN')}/T
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{pw.description}</p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Suitable Residues:</span>
                <span className="text-emerald-300 font-semibold">{pw.suitableWasteTypes?.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">CO2e Offset Factor:</span>
                <span className="text-purple-300 font-bold">{pw.carbonOffsetFactor || 1.45} kg CO2e / kg waste</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status: <strong className="text-emerald-400">Active in AI Engine</strong></span>
              <span>Min Batch: {pw.minimumQuantityKg || 100} kg</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
