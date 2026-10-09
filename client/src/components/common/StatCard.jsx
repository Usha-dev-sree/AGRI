import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, unit = '', subtitle, icon: Icon, trend, trendValue, color = 'emerald' }) => {
  const colorGradients = {
    emerald: 'from-emerald-500/20 to-emerald-900/5 text-emerald-400 border-emerald-500/25',
    blue: 'from-blue-500/20 to-blue-900/5 text-blue-400 border-blue-500/25',
    cyan: 'from-cyan-500/20 to-cyan-900/5 text-cyan-400 border-cyan-500/25',
    purple: 'from-purple-500/20 to-purple-900/5 text-purple-400 border-purple-500/25',
    amber: 'from-amber-500/20 to-amber-900/5 text-amber-400 border-amber-500/25'
  };

  return (
    <div className={`glass-card p-5 rounded-2xl bg-gradient-to-br ${colorGradients[color] || colorGradients.emerald} relative overflow-hidden group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1.5">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</h3>
            {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-slate-900/60 border border-white/5 text-white/90 shadow-inner group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5 text-current" />
          </div>
        )}
      </div>

      {trendValue && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs">
          {trend === 'up' ? (
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +{trendValue}
            </span>
          ) : (
            <span className="flex items-center text-rose-400 font-semibold gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> -{trendValue}
            </span>
          )}
          <span className="text-slate-400 font-normal">vs last harvest cycle</span>
        </div>
      )}
    </div>
  );
};
