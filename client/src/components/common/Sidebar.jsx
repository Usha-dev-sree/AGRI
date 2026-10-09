import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ScanLine,
  Trash2,
  Trees,
  Sprout,
  Store,
  Truck,
  Building2,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  Activity,
  Compass
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'farmer';

  const farmerNav = [
    { label: 'Farmer Dashboard', to: '/farmer', icon: LayoutDashboard, exact: true },
    { label: 'AI Waste Scanner', to: '/farmer/ai-scanner', icon: ScanLine, highlight: true },
    { label: 'Waste Management', to: '/farmer/waste', icon: Trash2 },
    { label: 'My Farms', to: '/farmer/farms', icon: Trees },
    { label: 'Crop Cultivation', to: '/farmer/crops', icon: Sprout },
    { label: 'Marketplace Listings', to: '/farmer/listings', icon: Store },
    { label: 'Pickup Logistics', to: '/farmer/pickups', icon: Truck }
  ];

  const processorNav = [
    { label: 'Processor Overview', to: '/processor', icon: LayoutDashboard, exact: true },
    { label: 'Waste Marketplace', to: '/processor/marketplace', icon: Store, highlight: true },
    { label: 'Procurement Demand', to: '/processor/requirements', icon: FileSpreadsheet },
    { label: 'AI Matches & Quotes', to: '/processor/matches', icon: Compass },
    { label: 'Logistics & Pickups', to: '/processor/pickups', icon: Truck }
  ];

  const adminNav = [
    { label: 'Executive Analytics', to: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Processor Verification', to: '/admin/users', icon: ShieldCheck },
    { label: 'Value Pathways Matrix', to: '/admin/pathways', icon: Layers },
    { label: 'Marketplace Oversight', to: '/processor/marketplace', icon: Store },
    { label: 'System Audit Trail', to: '/admin/audit', icon: Activity }
  ];

  const navItems = role === 'admin' ? adminNav : role === 'processor' ? processorNav : farmerNav;

  return (
    <aside className="w-64 glass-panel border-r border-emerald-500/15 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
            {role.toUpperCase()} PORTAL NAVIGATION
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                        : item.highlight
                        ? 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/20 bg-emerald-950/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${item.highlight ? 'text-emerald-400 animate-pulse' : ''}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">
                      AI Core
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Impact Box */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-emerald-950/60 to-slate-950/80 border border-emerald-500/20 text-center">
          <p className="text-[11px] font-bold text-emerald-400 flex items-center justify-center gap-1.5">
            🌱 Circular Agro-Economy
          </p>
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            Zero stubble burning. 100% value recovery powered by AI.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 text-[10px] text-slate-400 text-center">
        <p className="font-semibold text-slate-400">AgriValue AI v2.4</p>
        <p>B.Tech Major Project Edition</p>
      </div>
    </aside>
  );
};
