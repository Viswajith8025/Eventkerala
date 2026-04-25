import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      window.dispatchEvent(new Event('authChange')); 
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side: Editorial Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-950 relative items-center justify-center p-20 overflow-hidden">
        <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
        >
            <img 
                src="https://images.unsplash.com/photo-1621614275066-51f7d5448378?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover"
                alt="Kerala Heritage"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-emerald-950/40 to-transparent"></div>
        </motion.div>

        <div className="relative z-10 space-y-12 max-w-xl">
            <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gold-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-gold-500/30 group-hover:bg-gold-500 group-hover:text-emerald-950 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white/50 uppercase tracking-[0.4em] group-hover:text-gold-500 transition-colors">Return to Legend</span>
            </Link>

            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-xs font-black text-gold-500 uppercase tracking-[0.4em]">Heritage Gateway</span>
                    <h1 className="text-7xl font-display text-white mt-4 leading-tight italic">Your journey <br /> <span className="text-gold-500">awaits.</span></h1>
                </motion.div>
                <p className="text-white/60 text-xl font-light italic leading-relaxed">
                    Re-enter the world of Gods Own Country. Exclusive festivals, hidden trails, and sacred rituals are just one step away.
                </p>
            </div>

            <div className="flex items-center gap-10 pt-10 border-t border-white/10">
                <div className="space-y-1">
                    <p className="text-3xl font-display text-white">100+</p>
                    <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Heritage Spots</p>
                </div>
                <div className="space-y-1">
                    <p className="text-3xl font-display text-white">14</p>
                    <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Districts Covered</p>
                </div>
                <div className="space-y-1">
                    <p className="text-3xl font-display text-white">24/7</p>
                    <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Real-time Pulse</p>
                </div>
            </div>
        </div>

        {/* Decorative Particles Mockup */}
        <div className="absolute bottom-10 right-10 opacity-20">
             <Sparkles className="w-20 h-20 text-gold-500 animate-pulse" />
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 bg-[#FDFDFF] relative">
        <div className="max-w-md w-full space-y-12">
          <div>
            <div className="flex lg:hidden items-center gap-3 mb-12">
               <div className="w-10 h-10 bg-emerald-900/5 rounded-xl flex items-center justify-center">
                  <img src="/logo.svg" className="w-6 h-6" alt="Logo" />
               </div>
               <span className="text-xl font-display font-black text-emerald-950">Live<span className="text-gold-600 italic">Keralam</span></span>
            </div>
            <h2 className="text-5xl font-display text-emerald-950 mb-4">Member <span className="text-gold-600 italic">Login.</span></h2>
            <p className="text-emerald-900/40 font-medium">Please enter your verified credentials to access the platform.</p>
          </div>

          {error && (
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-emerald-950/40 uppercase tracking-[0.2em] ml-1">Email Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-gold-600 transition-colors w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full bg-emerald-900/5 border border-emerald-900/5 focus:bg-white focus:border-gold-500/50 focus:ring-8 focus:ring-gold-500/5 rounded-[1.5rem] py-5 pl-16 pr-6 transition-all text-emerald-950 font-medium placeholder:text-emerald-900/20"
                  placeholder="name@heritage.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-emerald-950/40 uppercase tracking-[0.2em]">Secure Password</label>
                <Link to="#" className="text-[10px] font-black text-gold-600 uppercase tracking-widest hover:text-emerald-950 transition-colors">Forgot Key?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-gold-600 transition-colors w-5 h-5" />
                <input
                  type="password"
                  required
                  className="w-full bg-emerald-900/5 border border-emerald-900/5 focus:bg-white focus:border-gold-500/50 focus:ring-8 focus:ring-gold-500/5 rounded-[1.5rem] py-5 pl-16 pr-6 transition-all text-emerald-950 font-medium placeholder:text-emerald-900/20"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-950 text-gold-500 font-black py-6 rounded-[1.5rem] transition-all shadow-2xl shadow-emerald-950/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gold-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
              ) : (
                <>
                  <span className="relative z-10 group-hover:text-emerald-950 transition-colors tracking-[0.3em] uppercase text-xs">Enter the Experience</span>
                  <LogIn className="w-4 h-4 relative z-10 group-hover:text-emerald-950 transition-colors" />
                </>
              )}
            </button>
          </form>

          <div className="pt-10 border-t border-emerald-900/5 text-center">
             <p className="text-emerald-900/40 text-sm font-medium">
                New to the platform?{' '}
                <Link to="/register" className="text-emerald-950 font-black hover:text-gold-600 transition-colors underline decoration-gold-500/30 underline-offset-8">
                  Request Private Access
                </Link>
             </p>
          </div>
        </div>

        {/* Floating Branding Bottom Right */}
        <div className="absolute bottom-10 right-10 hidden md:block">
            <span className="text-[10px] font-black text-emerald-900/10 uppercase tracking-[1em]">Authenticity Verified</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
