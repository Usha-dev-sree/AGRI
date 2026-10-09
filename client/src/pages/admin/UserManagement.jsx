import React, { useState, useEffect } from 'react';
import { processorAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Users, ShieldCheck, CheckCircle2, XCircle, Search, Building2 } from 'lucide-react';

export const UserManagement = () => {
  const [processors, setProcessors] = useState([]);

  useEffect(() => {
    loadProcessors();
  }, []);

  const loadProcessors = async () => {
    try {
      const res = await processorAPI.getAllProcessors();
      if (res.success) setProcessors(res.data);
    } catch (e) {
      console.warn('Error fetching processors');
    }
  };

  const handleToggleStatus = (id, newStatus) => {
    setProcessors(processors.map(p => p._id === id ? { ...p, verificationStatus: newStatus } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">Admin User & KYC Governance</Badge>
            <Badge variant="emerald">{processors.length} Processing Plants</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Processor Verification & User Directory
          </h1>
          <p className="text-xs text-slate-300">
            Verify business credentials, GST registrations, and plant capacities to ensure safe commercial trading.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[10px] uppercase font-bold text-slate-400 border-b border-white/5">
              <tr>
                <th className="p-4">Organization / Facility</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Monthly Capacity</th>
                <th className="p-4">KYC Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processors.map((proc) => (
                <tr key={proc._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p>{proc.companyName}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{proc.registrationNumber || 'REG-TS-2023'}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{proc.processorType}</td>
                  <td className="p-4">{proc.location?.district}, {proc.location?.state}</td>
                  <td className="p-4 font-bold text-white">{proc.capacityMonthlyTons || 150} Tonnes</td>
                  <td className="p-4">
                    <Badge variant={proc.verificationStatus === 'Verified' ? 'emerald' : 'amber'}>
                      {proc.verificationStatus || 'Verified'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    {proc.verificationStatus !== 'Verified' ? (
                      <button
                        onClick={() => handleToggleStatus(proc._id, 'Verified')}
                        className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30"
                      >
                        Approve KYC
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
