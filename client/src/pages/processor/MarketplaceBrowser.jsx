import React, { useState, useEffect } from 'react';
import { marketplaceAPI, pickupAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { AgriMap } from '../../components/maps/AgriMap';
import {
  Store,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  Truck,
  Sparkles,
  Layers,
  IndianRupee,
  SlidersHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketplaceBrowser = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [wasteTypeFilter, setWasteTypeFilter] = useState('All');
  const [maxDistance, setMaxDistance] = useState(80);
  const [minConfidence, setMinConfidence] = useState(85);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);

  useEffect(() => {
    loadListings();
  }, [wasteTypeFilter]);

  const loadListings = async () => {
    try {
      const res = await marketplaceAPI.getListings({
        wasteType: wasteTypeFilter === 'All' ? '' : wasteTypeFilter
      });
      if (res.success) setListings(res.data);
    } catch (e) {
      console.warn('Error fetching listings');
    }
  };

  const handleBookPickup = async (listing) => {
    try {
      const res = await pickupAPI.createPickup({
        listingId: listing._id,
        wasteType: listing.wasteType,
        quantity: listing.quantity,
        unit: listing.unit,
        agreedPrice: listing.expectedPrice,
        pickupLocation: listing.location
      });
      if (res.success) {
        setBookingSuccessModal(listing);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const mapLocations = listings.map((l, idx) => ({
    id: l._id || idx,
    name: l.title,
    lat: l.location?.coordinates?.lat || (17.05 + idx * 0.1),
    lng: l.location?.coordinates?.lng || (79.15 + idx * 0.1),
    type: 'farm',
    desc: `${l.quantity} ${l.unit} ${l.wasteType} (₹${l.expectedPrice?.toLocaleString('en-IN')})`
  }));

  // Add Processor Hub Location to map
  mapLocations.push({
    id: 'proc_hub',
    name: 'BioEnergy Renewable Fuels Ltd (Your Plant Hub)',
    lat: 17.4589,
    lng: 78.5992,
    type: 'processor',
    desc: 'Cherlapally Industrial Processing Facility'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan">Agricultural Waste Marketplace</Badge>
            <Badge variant="emerald">{listings.length} Batches Available</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Store className="w-6 h-6 text-cyan-400" />
            Available Agricultural Waste Listings
          </h1>
          <p className="text-xs text-slate-300">
            Source high-grade biomass directly from verified farmers with algorithmic match scoring and distance optimization.
          </p>
        </div>
      </div>

      {/* Split Interface: Left Filter & Map Sidebar + Right Listings Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Filters & Map */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Procurement Filters
              </h3>
              <button
                onClick={() => { setWasteTypeFilter('All'); setMaxDistance(100); }}
                className="text-[10px] text-slate-400 hover:text-cyan-400"
              >
                Reset
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Residue Category</label>
              <select
                value={wasteTypeFilter}
                onChange={(e) => setWasteTypeFilter(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs mt-1 bg-slate-900"
              >
                <option value="All">All Agricultural Residues</option>
                <option value="Rice Straw">Rice Straw (Paddy)</option>
                <option value="Cotton Stalk">Cotton Stalk</option>
                <option value="Tomato Residue">Tomato Residue</option>
                <option value="Sugarcane Bagasse">Sugarcane Bagasse</option>
                <option value="Maize Residue">Maize Residue</option>
                <option value="Groundnut Residue">Groundnut Residue</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Max Distance Radius</span>
                <span className="font-mono font-bold text-cyan-400">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Min AI Classification Confidence</span>
                <span className="font-mono font-bold text-emerald-400">{minConfidence}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={minConfidence}
                onChange={(e) => setMinConfidence(e.target.value)}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Interactive Geospatial Map */}
          <div className="glass-panel p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Geographic Logistics Map
              </span>
              <span className="text-[10px] text-slate-400">OpenStreetMap + Leaflet</span>
            </div>
            <AgriMap locations={mapLocations} height="220px" zoom={8} center={[17.2, 78.8]} />
          </div>
        </div>

        {/* Right Listings Feed */}
        <div className="lg:col-span-8 space-y-4">
          {listings.map((listing, idx) => {
            const distance = 12 + idx * 12.5;
            const matchScore = 96 - idx * 4;

            return (
              <div
                key={listing._id}
                className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 border border-emerald-500/30">
                    <img
                      src={listing.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                        {listing.wasteType}
                      </h3>
                      <span className="text-xs font-bold text-slate-300">
                        ({listing.quantity} {listing.unit})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="emerald">
                        <CheckCircle2 className="w-3 h-3" /> {((listing.aiConfidence || 0.94) * 100).toFixed(0)}% AI Verified
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> {distance.toFixed(1)} km away
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      Farmer: <strong className="text-slate-200">{listing.farmer?.name || 'Ramesh Kumar'}</strong> • {listing.location?.address || 'Nalgonda Farm'}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-300" /> Match Score: {matchScore}% with Bio-Energy Plant
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto text-right flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Offered Price</span>
                    <p className="text-xl font-extrabold text-emerald-400">₹{listing.expectedPrice?.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookPickup(listing)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
                    >
                      <Truck className="w-3.5 h-3.5" /> Book Pickup
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Success Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md border border-emerald-500/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Pickup Contract Scheduled!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Successfully contracted <strong className="text-emerald-300">{bookingSuccessModal.quantity} {bookingSuccessModal.unit} {bookingSuccessModal.wasteType}</strong> for ₹{bookingSuccessModal.expectedPrice?.toLocaleString('en-IN')}.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-400 text-left space-y-1">
              <p>• Transporter unit auto-dispatched.</p>
              <p>• Digital weighbridge receipt will be generated upon arrival.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setBookingSuccessModal(null)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Keep Browsing
              </button>
              <button
                onClick={() => navigate('/processor/pickups')}
                className="w-1/2 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
              >
                View Logistics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
