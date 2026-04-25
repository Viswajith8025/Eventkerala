import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
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
                src="https://images.unsplash.com/photo-1596443329712-4f7f2b60453e?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover"
                alt="Kerala Sacred Rituals"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/50 to-transparent"></div>
        </motion.div>

        <div className="relative z-10 space-y-12 max-w-xl">
            <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gold-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-gold-500/30 group-hover:bg-gold-500 group-hover:text-emerald-950 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white/50 uppercase tracking-[0.4em] group-hover:text-gold-500 transition-colors">Return to Exploration</span>
            </Link>

            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-xs font-black text-gold-500 uppercase tracking-[0.4em]">Become a Guardian</span>
                    <h1 className="text-7xl font-display text-white mt-4 leading-tight italic">Join the <br /> <span className="text-gold-500">Legend.</span></h1>
                </motion.div>
                <p className="text-white/60 text-xl font-light italic leading-relaxed">
                    Access the world’s most comprehensive heritage platform. Be the first to witness exclusive festivals and contribute to the pulse of Gods Own Country.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-10 border-t border-white/10">
                {[
                    'Priority Alerts for Sacred Festivals',
                    'Personalized Heritage Matchmaker',
                    'Curated Hidden Trails & Landmarks',
                    'Contributor Access for Cultural Events'
                ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + (i * 0.1) }}
                        className="flex items-center gap-4 text-white/80"
                    >
                        <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                        <span className="text-sm font-medium tracking-wide italic">{feature}</span>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Decorative Particles Mockup */}
        <div className="absolute top-10 right-10 opacity-10">
             <Sparkles className="w-40 h-40 text-gold-500 rotate-12" />
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 bg-[#FDFDFF] relative overflow-y-auto">
        <div className="max-w-md w-full py-12">
          <div className="mb-12">
            <div className="flex lg:hidden items-center gap-3 mb-12">
               <div className="w-10 h-10 bg-emerald-900/5 rounded-xl flex items-center justify-center">
                  <img src="/logo.svg" className="w-6 h-6" alt="Logo" />
               </div>
               <span className="text-xl font-display font-black text-emerald-950">Live<span className="text-gold-600 italic">Keralam</span></span>
            </div>
            <h2 className="text-5xl font-display text-emerald-950 mb-4">Request <span className="text-gold-600 italic">Access.</span></h2>
            <p className="text-emerald-900/40 font-medium">Join our curated community of cultural explorers and heritage guardians.</p>
          </div>

          {error && (
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-emerald-950/40 uppercase tracking-[0.2em] ml-1">Guardian Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-gold-600 transition-colors w-5 h-5" />
                <input
                  type="text"
                  required
                  className="w-full bg-emerald-900/5 border border-emerald-900/5 focus:bg-white focus:border-gold-500/50 focus:ring-8 focus:ring-gold-500/5 rounded-[1.5rem] py-5 pl-16 pr-6 transition-all text-emerald-950 font-medium placeholder:text-emerald-900/20"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-emerald-950/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-gold-600 transition-colors w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full bg-emerald-900/5 border border-emerald-900/5 focus:bg-white focus:border-gold-500/50 focus:ring-8 focus:ring-gold-500/5 rounded-[1.5rem] py-5 pl-16 pr-6 transition-all text-emerald-950 font-medium placeholder:text-emerald-900/20"
                  placeholder="explorer@heritage.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-emerald-950/40 uppercase tracking-[0.2em] ml-1">Vault Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-gold-600 transition-colors w-5 h-5" />
                <input
                  type="password"
                  required
                  className="w-full bg-emerald-900/5 border border-emerald-900/5 focus:bg-white focus:border-gold-500/50 focus:ring-8 focus:ring-gold-500/5 rounded-[1.5rem] py-5 pl-16 pr-6 transition-all text-emerald-950 font-medium placeholder:text-emerald-900/20"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
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
                    <span className="relative z-10 group-hover:text-emerald-950 transition-colors tracking-[0.3em] uppercase text-xs">Establish Membership</span>
                    <UserPlus className="w-4 h-4 relative z-10 group-hover:text-emerald-950 transition-colors" />
                    </>
                )}
                </button>
            </div>
          </form>

          <div className="pt-10 border-t border-emerald-900/5 text-center">
             <p className="text-emerald-900/40 text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-950 font-black hover:text-gold-600 transition-colors underline decoration-gold-500/30 underline-offset-8">
                  Sign in to Vault
                </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
