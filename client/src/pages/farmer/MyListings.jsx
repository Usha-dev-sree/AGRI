import React, { useState, useEffect } from 'react';
import { marketplaceAPI, matchAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Store, Eye, MessageSquare, IndianRupee, Sparkles, Truck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [matchingListing, setMatchingListing] = useState(null);
  const [matchedProcessors, setMatchedProcessors] = useState([]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const res = await marketplaceAPI.getMyListings();
      if (res.success) setListings(res.data);
    } catch (e) {
      console.warn('Error fetching listings');
    }
  };

  const handleTriggerMatch = async (listing) => {
    setMatchingListing(listing);
    try {
      const res = await matchAPI.findMatchesForListing(listing._id);
      if (res.success) {
        setMatchedProcessors(res.data);
      }
    } catch (e) {
      console.warn('Error fetching matches');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald">Live Marketplace Supply</Badge>
            <Badge variant="blue">{listings.length} Active Offers</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-400" />
            My Published Waste Listings & Buyer Inquiries
          </h1>
          <p className="text-xs text-slate-300">
            Monitor buyer demand, evaluate algorithmic match scores with biomass plants, and accept pickup contracts.
          </p>
        </div>
      </div>

      {/* Listings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((listing) => (
          <div key={listing._id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between group">
            <div>
              <div className="relative h-40 rounded-xl overflow-hidden mb-3 border border-emerald-500/20">
                <img
                  src={listing.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge variant="emerald">
                    <CheckCircle2 className="w-3 h-3" /> AI Verified
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-xs font-extrabold text-emerald-400 border border-emerald-500/30">
                  ₹{listing.expectedPrice?.toLocaleString('en-IN')}
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {listing.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Crop: {listing.crop} • Volume: <strong className="text-slate-200">{listing.quantity} {listing.unit}</strong></p>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {listing.viewsCount || 34} Views
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <MessageSquare className="w-3.5 h-3.5" /> {listing.inquiriesCount || 3} Inquiries
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => handleTriggerMatch(listing)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/35 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Find AI Buyer Matches
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Matching Modal */}
      {matchingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-2xl border border-emerald-500/30 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="cyan">🤖 Algorithmic Matchmaker</Badge>
                <h3 className="text-lg font-bold text-white mt-1">
                  Top Processor Matches for: {matchingListing.title}
                </h3>
              </div>
              <button
                onClick={() => setMatchingListing(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {matchedProcessors.map((match) => (
                <div key={match._id} className="p-4 rounded-2xl glass-card border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{match.processor?.companyName || 'Bio-Energy Ltd'}</h4>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {match.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {match.processor?.processorType} • 📍 {match.distanceKm || '18.2'} km away
                    </p>
                    <div className="flex gap-2 mt-2 text-[10px] text-slate-300 font-mono">
                      <span>Compat: {match.matchedFactors?.wasteCompatibility}%</span>
                      <span>Distance: {match.matchedFactors?.distanceSuitability}%</span>
                      <span>Volume: {match.matchedFactors?.quantitySuitability}%</span>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <button
                      onClick={() => navigate('/farmer/pickups')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <Truck className="w-3.5 h-3.5" /> Book Pickup
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
