import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/common/Badge';
import { Activity, ShieldCheck, Clock, User, Server } from 'lucide-react';

export const SystemAuditLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 'aud_1',
      action: 'PROCESSOR_KYC_VERIFIED',
      entity: 'Processor',
      userName: 'Dr. K. Rao (Admin)',
      userRole: 'admin',
      details: 'Approved BioEnergy Renewable Fuels Ltd for commercial trading',
      ipAddress: '192.168.1.101',
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: 'aud_2',
      action: 'AI_WASTE_CLASSIFICATION',
      entity: 'WasteReport',
      userName: 'Ramesh Kumar (Farmer)',
      userRole: 'farmer',
      details: 'Classified 2.5T Rice Straw with 94.2% Softmax confidence via MobileNetV3',
      ipAddress: '192.168.1.145',
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      id: 'aud_3',
      action: 'PICKUP_SCHEDULED',
      entity: 'PickupRequest',
      userName: 'Priya Reddy (Processor)',
      userRole: 'processor',
      details: 'Scheduled logistics truck TS 08 UB 4512 with driver Sunil K.',
      ipAddress: '192.168.1.210',
      timestamp: new Date(Date.now() - 65 * 60 * 1000)
    },
    {
      id: 'aud_4',
      action: 'MARKETPLACE_LISTING_CREATED',
      entity: 'MarketplaceListing',
      userName: 'Ramesh Kumar (Farmer)',
      userRole: 'farmer',
      details: 'Published 1.8T Cotton Stalks listing for ₹9,500',
      ipAddress: '192.168.1.145',
      timestamp: new Date(Date.now() - 120 * 60 * 1000)
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">Compliance & System Governance</Badge>
            <Badge variant="emerald"><Activity className="w-3 h-3" /> Immutable Audit Trail</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            Platform System Audit Logs
          </h1>
          <p className="text-xs text-slate-300">
            End-to-end event logging for authentication, AI inferences, marketplace trades, and administrative approvals.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <div className="divide-y divide-white/5">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-purple-500/20 text-purple-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{log.action}</span>
                    <Badge variant={log.userRole === 'admin' ? 'purple' : log.userRole === 'processor' ? 'cyan' : 'emerald'}>
                      {log.userRole}
                    </Badge>
                  </div>
                  <p className="text-slate-300 mt-1">{log.details}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Actor: <strong className="text-slate-400">{log.userName}</strong> • IP: {log.ipAddress}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-mono">Entity: {log.entity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
