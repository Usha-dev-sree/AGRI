import React, { useState, useEffect } from 'react';
import { pickupAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Truck, MapPin, Calendar, CheckCircle2, Clock, Phone, AlertCircle } from 'lucide-react';

const STAGES = ['Requested', 'Accepted', 'Scheduled', 'In-Transit', 'Collected', 'Completed'];

export const FarmerPickups = () => {
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    loadPickups();
  }, []);

  const loadPickups = async () => {
    try {
      const res = await pickupAPI.getMyPickups();
      if (res.success) setPickups(res.data);
    } catch (e) {
      console.warn('Error fetching pickups');
    }
  };

  const getStageIndex = (status) => {
    const idx = STAGES.indexOf(status);
    return idx === -1 ? 2 : idx;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan">6-Stage Logistics Pipeline</Badge>
            <Badge variant="emerald">{pickups.length} Dispatches Active</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Truck className="w-6 h-6 text-cyan-400" />
            Agricultural Waste Pickup & Logistics Tracker
          </h1>
          <p className="text-xs text-slate-300">
            Real-time status updates from driver dispatch to weighbridge verification and automated payment settlement.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {pickups.map((pickup) => {
          const currentStage = getStageIndex(pickup.status);
          return (
            <div key={pickup._id} className="glass-panel p-6 rounded-3xl border border-emerald-500/25 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {pickup.wasteType} ({pickup.quantity} {pickup.unit || 'tonnes'})
                    </h3>
                    <Badge variant={pickup.status === 'Completed' ? 'emerald' : 'cyan'}>
                      {pickup.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Pickup from: {pickup.pickupLocation?.address || 'Green Valley Farm, Nalgonda'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Agreed Settlement</span>
                  <p className="text-xl font-extrabold text-emerald-400">₹{(pickup.agreedPrice || 12000).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* 6-Stage Progress Stepper */}
              <div className="relative pt-2 pb-2">
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
                <div
                  className="hidden sm:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-400 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
                ></div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative z-10">
                  {STAGES.map((stage, idx) => {
                    const isPassed = idx <= currentStage;
                    const isCurrent = idx === currentStage;
                    return (
                      <div key={stage} className="flex flex-col items-center text-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPassed
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40 ring-4 ring-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-semibold mt-1.5 ${isCurrent ? 'text-emerald-300 font-bold' : isPassed ? 'text-slate-200' : 'text-slate-500'}`}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Driver & Logistics Info Grid */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Transporter</span>
                  <p className="text-white font-semibold mt-0.5">{pickup.driverDetails?.driverName || 'Sunil Kumar Logistics'}</p>
                  <p className="text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {pickup.driverDetails?.driverPhone || '+91 94401 98765'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Vehicle Logistics Unit</span>
                  <p className="text-white font-semibold mt-0.5">{pickup.driverDetails?.vehicleNumber || 'TS 08 UB 4512'}</p>
                  <p className="text-slate-400 mt-0.5">{pickup.driverDetails?.vehicleType || 'Eicher 14-Ft Flatbed'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Scheduled Arrival</span>
                  <p className="text-cyan-300 font-bold mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(pickup.scheduledDate || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
