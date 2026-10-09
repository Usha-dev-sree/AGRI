import React from 'react';

export const Badge = ({ children, variant = 'emerald', className = '' }) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    red: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    slate: 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variantStyles[variant] || variantStyles.emerald} ${className}`}>
      {children}
    </span>
  );
};
