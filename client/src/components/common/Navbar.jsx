import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Bell, Search, User, Shield, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-500/15 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <Leaf className="w-5 h-5 text-slate-950 fill-slate-950 stroke-1" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              AgriValue
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              AI
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">Waste-to-Value Platform</p>
        </div>
      </Link>



      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button className="p-2 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 hover:text-white hover:border-emerald-500/30 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        </div>

        {/* User Pill or Login Links */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
          {user ? (
            <>
              <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold overflow-hidden shadow-inner">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                Log In
              </Link>
              <Link to="/register" className="text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 rounded-lg transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
