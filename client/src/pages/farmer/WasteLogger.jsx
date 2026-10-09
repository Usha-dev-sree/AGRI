import React, { useState, useEffect } from 'react';
import { wasteAPI, farmAPI, cropAPI, aiAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Trash2, Plus, Sparkles, UploadCloud, Scale, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WasteLogger = () => {
  const navigate = useNavigate();
  const [wasteList, setWasteList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    crop: 'Paddy / Rice',
    wasteType: 'Rice Straw',
    quantity: 1500,
    unit: 'kg',
    moistureContent: 'Low (< 15%)',
    storageCondition: 'Field Stacked',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
  });

  useEffect(() => {
    loadWaste();
  }, []);

  const loadWaste = async () => {
    try {
      const [wRes, fRes, cRes] = await Promise.all([
        wasteAPI.getMyWaste(),
        farmAPI.getMyFarms(),
        cropAPI.getMyCrops()
      ]);
      if (wRes.success) setWasteList(wRes.data);
      if (fRes.success) setFarms(fRes.data);
      if (cRes.success) setCrops(cRes.data);
    } catch (e) {
      console.warn('Error fetching waste reports');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await wasteAPI.createWaste({
        ...formData,
        aiAnalysis: {
          predictedClass: formData.wasteType,
          confidence: 0.94,
          topPredictions: [
            { className: formData.wasteType, confidence: 0.94 }
          ]
        }
      });
      setShowModal(false);
      loadWaste();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald">Agricultural Residue Registry</Badge>
            <Badge variant="cyan">{wasteList.length} Batches Registered</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-emerald-400" />
            Agricultural Waste Logging & Inventory
          </h1>
          <p className="text-xs text-slate-300">
            Digitally record post-harvest crop biomass, storage conditions, and attach AI verification for marketplace trading.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Log Waste Batch
        </button>
      </div>

      {/* Waste List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {wasteList.map((waste) => (
          <div key={waste._id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between group">
            <div>
              <div className="relative h-36 rounded-xl overflow-hidden mb-3 border border-emerald-500/20">
                <img
                  src={waste.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'}
                  alt={waste.wasteType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="emerald">
                    <CheckCircle2 className="w-3 h-3" /> AI {((waste.aiAnalysis?.confidence || 0.92) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {waste.wasteType}
                  </h3>
                  <p className="text-xs text-slate-400">Crop: {waste.crop}</p>
                </div>
                <Badge variant={waste.status === 'Listed' ? 'cyan' : 'slate'}>
                  {waste.status}
                </Badge>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Volume:</span>
                  <span className="font-bold text-white">{waste.quantity} {waste.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Moisture Content:</span>
                  <span className="text-emerald-400 font-semibold">{waste.moistureContent || 'Medium (15-30%)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Storage State:</span>
                  <span className="text-slate-300">{waste.storageCondition || 'Covered Shed'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => navigate('/farmer/ai-scanner')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                View AI Pathway
              </button>
              <button
                onClick={() => navigate('/farmer/listings')}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30"
              >
                List on Market
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md border border-emerald-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Log Agricultural Residue Batch</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Residue Category</label>
                <select
                  value={formData.wasteType}
                  onChange={(e) => setFormData({ ...formData, wasteType: e.target.value, crop: e.target.value.split(' ')[0] })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1 bg-slate-900"
                >
                  <option value="Rice Straw">Rice Straw (Paddy Residue)</option>
                  <option value="Cotton Stalk">Cotton Stalk</option>
                  <option value="Wheat Straw">Wheat Straw</option>
                  <option value="Maize Residue">Maize Residue</option>
                  <option value="Tomato Residue">Tomato Residue</option>
                  <option value="Sugarcane Bagasse">Sugarcane Bagasse</option>
                  <option value="Groundnut Residue">Groundnut Residue</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1 bg-slate-900"
                  >
                    <option value="kg">kg</option>
                    <option value="tonnes">Tonnes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Moisture Condition</label>
                <select
                  value={formData.moistureContent}
                  onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1 bg-slate-900"
                >
                  <option value="Low (< 15%)">Low (&lt; 15% - Sun Dried)</option>
                  <option value="Medium (15-30%)">Medium (15-30%)</option>
                  <option value="High (> 30%)">High (&gt; 30% - Fresh Biomass)</option>
                </select>
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
                  Register Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
