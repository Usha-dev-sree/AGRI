import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(`/${res.user.role || 'farmer'}`);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Server may be warming up, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md border border-emerald-500/25 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to AgriValue AI</h2>
          <p className="text-xs text-slate-400">Access your role-specific dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating & Proceeding...</span>
              </>
            ) : (
              <span>Authenticate & Proceed &rarr;</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};
