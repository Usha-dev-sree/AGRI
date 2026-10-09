import React, { useState, useEffect } from 'react';
import { farmAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Trees, Plus, MapPin, Droplets, Layers, Trash2 } from 'lucide-react';

export const FarmManager = () => {
  const [farms, setFarms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    address: 'Chityal Mandal',
    district: 'Nalgonda',
    state: 'Telangana',
    area: 5,
    areaUnit: 'acres',
    soilType: 'Black Soil',
    irrigationType: 'Drip Irrigation'
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const res = await farmAPI.getMyFarms();
      if (res.success) setFarms(res.data);
    } catch (e) {
      console.warn('Error fetching farms');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await farmAPI.createFarm({
        farmName: formData.farmName,
        location: {
          address: formData.address,
          district: formData.district,
          state: formData.state,
          coordinates: { lat: 17.0577, lng: 79.2684 }
        },
        area: formData.area,
        areaUnit: formData.areaUnit,
        soilType: formData.soilType,
        irrigationType: formData.irrigationType
      });
      setShowModal(false);
      loadFarms();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this farm profile?')) {
      await farmAPI.deleteFarm(id);
      loadFarms();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald">Land & Farm Profiling</Badge>
            <Badge variant="blue">{farms.length} Parcels Registered</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Trees className="w-6 h-6 text-emerald-400" />
            My Registered Farms & Soil Profiles
          </h1>
          <p className="text-xs text-slate-300">
            Maintain accurate geolocation, soil classification, and irrigation parameters for accurate biomass estimation.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Register New Farm
        </button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {farms.map((farm) => (
          <div key={farm._id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {farm.farmName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {farm.location?.address || farm.location?.district}, {farm.location?.state}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(farm._id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold">Total Acreage</span>
                  <p className="font-bold text-white mt-0.5">{farm.area} {farm.areaUnit || 'acres'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold">Soil Profile</span>
                  <p className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> {farm.soilType || 'Black Soil'}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase text-slate-500 font-bold">Irrigation Infrastructure</span>
                  <p className="font-semibold text-cyan-300 mt-0.5 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5" /> {farm.irrigationType || 'Drip Irrigation'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>LAT: {farm.location?.coordinates?.lat || '17.0577'}</span>
              <span>LNG: {farm.location?.coordinates?.lng || '79.2684'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding a new farm */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md border border-emerald-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Register New Farm Parcel</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Farm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Valley Farm"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Area (Acreage)</label>
                  <input
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Unit</label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1 bg-slate-900"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="bigha">Bigha</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Soil Type</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1 bg-slate-900"
                >
                  <option value="Black Soil">Black Soil</option>
                  <option value="Red Soil">Red Soil</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Irrigation Type</label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs mt-1 bg-slate-900"
                >
                  <option value="Drip Irrigation">Drip Irrigation</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Borewell / Tube Well">Borewell / Tube Well</option>
                  <option value="Canal / Flood">Canal / Flood</option>
                  <option value="Rainfed">Rainfed</option>
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
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
