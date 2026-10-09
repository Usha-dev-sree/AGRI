import React, { useState, useEffect } from 'react';
import { pickupAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Truck, MapPin, Calendar, CheckCircle2, Phone, ArrowUpRight } from 'lucide-react';

export const ProcessorPickups = () => {
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

  const handleAdvanceStatus = async (pickupId, nextStatus) => {
    try {
      await pickupAPI.updatePickupStatus(pickupId, { status: nextStatus });
      loadPickups();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan">Logistics Management</Badge>
            <Badge variant="emerald">{pickups.length} Active Dispatches</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Truck className="w-6 h-6 text-cyan-400" />
            Transporter Dispatch & Weighbridge Verification
          </h1>
          <p className="text-xs text-slate-300">
            Dispatch fleet trucks, track GPS route arrival at farm sites, and approve automated weighbridge settlement receipts.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {pickups.map((pickup) => (
          <div key={pickup._id} className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Farm: {pickup.pickupLocation?.address || 'Nalgonda, Telangana'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Payable Total</span>
                  <p className="text-lg font-extrabold text-emerald-400">₹{(pickup.agreedPrice || 12000).toLocaleString('en-IN')}</p>
                </div>

                {pickup.status !== 'Completed' && (
                  <button
                    onClick={() => {
                      const next = pickup.status === 'Scheduled' ? 'In-Transit' : pickup.status === 'In-Transit' ? 'Collected' : 'Completed';
                      handleAdvanceStatus(pickup._id, next);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
                  >
                    <span>Advance to {pickup.status === 'Scheduled' ? 'In-Transit' : pickup.status === 'In-Transit' ? 'Collected' : 'Complete'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Transporter</span>
                <p className="text-white font-semibold mt-0.5">{pickup.driverDetails?.driverName || 'Sunil Kumar Logistics'}</p>
                <p className="text-cyan-400 flex items-center gap-1 mt-0.5">
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
                <p className="text-emerald-300 font-bold mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(pickup.scheduledDate || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
