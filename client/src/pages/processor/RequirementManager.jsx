import React, { useState, useEffect } from 'react';
import { processorAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { FileSpreadsheet, Plus, Calendar, Scale, IndianRupee, MapPin } from 'lucide-react';

export const RequirementManager = () => {
  const [requirements, setRequirements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Immediate Requirement: 50 Tonnes Rice Straw / Cotton Stalks',
    wasteTypes: ['Rice Straw', 'Cotton Stalk'],
    targetQuantity: 50,
    unit: 'tonnes',
    offeredPricePerUnit: 5200,
    maxProcurementDistanceKm: 120,
    notes: 'Baled or bundled straw preferred. Immediate payment upon weighbridge verification.'
  });

  useEffect(() => {
    loadReqs();
  }, []);

  const loadReqs = async () => {
    try {
      const res = await processorAPI.getRequirements();
      if (res.success) setRequirements(res.data);
    } catch (e) {
      console.warn('Error loading requirements');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await processorAPI.postRequirement(formData);
      setShowModal(false);
      loadReqs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan">Industrial Feedstock Demand</Badge>
            <Badge variant="emerald">{requirements.length} Active RFP Posts</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
            Procurement Demand & Request for Proposals (RFP)
          </h1>
          <p className="text-xs text-slate-300">
            Publish your plant's biomass appetite, target residue types, budget per ton, and maximum logistics radius.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Post Procurement RFP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {requirements.map((req) => (
          <div key={req._id} className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="cyan">{req.status}</Badge>
                <h3 className="text-base font-bold text-white mt-2">{req.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target Waste: <span className="text-emerald-300 font-semibold">{req.wasteTypes?.join(', ')}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Offer / Unit</span>
                <p className="text-lg font-extrabold text-emerald-400">₹{req.offeredPricePerUnit?.toLocaleString('en-IN')}/{req.unit || 'ton'}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Fulfillment Progress:</span>
                <span className="font-bold text-cyan-400">{req.fulfilledQuantity || 24.5} / {req.targetQuantity} {req.unit || 'tonnes'} (49%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style={{ width: '49%' }}></div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Max Radius: <strong className="text-slate-200">{req.maxProcurementDistanceKm || 120} km</strong>
              </p>
              <p className="text-[11px] text-slate-400 italic">"{req.notes}"</p>
            </div>
          </div>
        ))}
      </div>

      {/* Post RFP Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md border border-cyan-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Post Procurement Demand RFP</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Procurement Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Target Quantity (Tonnes)</label>
                  <input
                    type="number"
                    required
                    value={formData.targetQuantity}
                    onChange={(e) => setFormData({ ...formData, targetQuantity: e.target.value })}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Offered Price / Ton</label>
                  <input
                    type="number"
                    required
                    value={formData.offeredPricePerUnit}
                    onChange={(e) => setFormData({ ...formData, offeredPricePerUnit: e.target.value })}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Max Distance (km)</label>
                <input
                  type="number"
                  required
                  value={formData.maxProcurementDistanceKm}
                  onChange={(e) => setFormData({ ...formData, maxProcurementDistanceKm: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Terms & Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20"
                >
                  Publish RFP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
