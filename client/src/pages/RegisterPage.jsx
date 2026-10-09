import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Lock, Mail, User, Phone, MapPin, Building2 } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer',
    address: 'Nalgonda District',
    district: 'Nalgonda',
    state: 'Telangana',
    companyName: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await register({
        ...formData,
        location: {
          address: formData.address,
          district: formData.district,
          state: formData.state,
          coordinates: { lat: 17.0577, lng: 79.2684 }
        }
      });
      if (res.success) {
        navigate(`/${formData.role}`);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md border border-emerald-500/25 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Platform Account</h2>
          <p className="text-xs text-slate-400">Join AgriValue AI ecosystem</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Account Role</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'farmer' })}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  formData.role === 'farmer'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'glass-input text-slate-400'
                }`}
              >
                👨🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'processor' })}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  formData.role === 'processor'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'glass-input text-slate-400'
                }`}
              >
                🏭 Processor / Buyer
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Full Name / Contact Person</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs mt-1"
            />
          </div>

          {formData.role === 'processor' && (
            <div>
              <label className="text-xs font-semibold text-slate-300">Company / Refinery Name</label>
              <input
                type="text"
                required
                placeholder="e.g. BioEnergy Fuels Ltd"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs mt-1"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-300">Email</label>
              <input
                type="email"
                required
                placeholder="name@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Phone</label>
              <input
                type="text"
                required
                placeholder="+91 98480..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              required
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform mt-2"
          >
            Create Account & Launch &rarr;
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
