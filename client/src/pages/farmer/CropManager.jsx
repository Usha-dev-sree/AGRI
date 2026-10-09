import React, { useState, useEffect } from 'react';
import { cropAPI, farmAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Sprout, Plus, Calendar, Scale, Trash2, CheckCircle, Clock } from 'lucide-react';

export const CropManager = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    farmId: '',
    cropName: '',
    variety: '',
    season: 'Kharif (Monsoon)',
    estimatedProduction: 10,
    productionUnit: 'tonnes',
    sowingDate: '2026-06-15',
    harvestDate: '2026-10-25'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cropRes, farmRes] = await Promise.all([cropAPI.getMyCrops(), farmAPI.getMyFarms()]);
      if (cropRes.success) setCrops(cropRes.data);
      if (farmRes.success) setFarms(farmRes.data);
    } catch (e) {
      console.warn('Error loading crops/farms');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await cropAPI.createCrop(formData);
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this crop cycle entry?')) {
      await cropAPI.deleteCrop(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald">Crop Production Tracking</Badge>
            <Badge variant="cyan">{crops.length} Active Seasons</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-400" />
            Crop Cultivation & Harvest Tracking
          </h1>
          <p className="text-xs text-slate-300">
            Log your cultivated crops, seasonal cycles, and expected harvest dates to predict upcoming agricultural residue volumes.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Crop Cultivation
        </button>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {crops.map((crop) => (
          <div key={crop._id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={crop.status === 'Harvested' ? 'emerald' : 'blue'}>
                      {crop.status}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-bold">{crop.season}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2 group-hover:text-emerald-300 transition-colors">
                    {crop.cropName}
                  </h3>
                  <p className="text-xs text-slate-400">Variety: <span className="text-slate-300">{crop.variety || 'Hybrid'}</span></p>
                </div>
                <button
                  onClick={() => handleDelete(crop._id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-cyan-400" /> Est. Harvest Production
                  </span>
                  <span className="font-bold text-white">{crop.estimatedProduction} {crop.productionUnit || 'tonnes'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Expected Harvest
                  </span>
                  <span className="font-bold text-emerald-300">
                    {new Date(crop.harvestDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sown: {new Date(crop.sowingDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              <span className="text-emerald-400 font-semibold">Residue Ready</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Crop Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md border border-emerald-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Add Crop Cultivation Cycle</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Farm Location</label>
                <select
                  value={formData.farmId}
                  onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1 bg-slate-900"
                >
                  <option value="">Select Farm...</option>
                  {farms.map((f) => (
                    <option key={f._id} value={f._id}>{f.farmName} ({f.location?.district})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Crop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paddy / Rice (BPT 5204)"
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Season</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1 bg-slate-900"
                  >
                    <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
                    <option value="Rabi (Winter)">Rabi (Winter)</option>
                    <option value="Zaid (Summer)">Zaid (Summer)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Est. Production (Tons)</label>
                  <input
                    type="number"
                    required
                    value={formData.estimatedProduction}
                    onChange={(e) => setFormData({ ...formData, estimatedProduction: e.target.value })}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Save Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
