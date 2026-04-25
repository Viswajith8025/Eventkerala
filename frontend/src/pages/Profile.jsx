import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Sparkles, Save, Shield, MapPin, Heart, ChevronRight, Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Temple Festivals', 
  'Sacred Rituals', 
  'Art Forms', 
  'Heritage Sites', 
  'Beach', 
  'Hill Station', 
  'Backwater', 
  'Waterfall', 
  'Nature',
  'Spiritual'
];

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    interests: user?.interests || []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     if (user) {
         setFormData({
             name: user.name,
             email: user.email,
             phone: user.phone || '',
             interests: user.interests || []
         });
     }
  }, [user]);

  const handleInterestToggle = (cat) => {
    const newInterests = formData.interests.includes(cat)
      ? formData.interests.filter(i => i !== cat)
      : [...formData.interests, cat];
    setFormData({ ...formData, interests: newInterests });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put('/user/profile', formData);
      if (response.data.success) {
        // Update local auth context with new user data
        login(localStorage.getItem('token'), response.data.data);
        toast.success('Profile Legend Updated', {
          style: { borderRadius: '1rem', background: '#064e3b', color: '#fbbf24' }
        });
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Personal Narrative */}
          <div className="lg:col-span-4 space-y-10">
             <div className="relative">
                <div className="w-48 h-48 bg-heritage-gradient rounded-[3rem] shadow-2xl relative overflow-hidden flex items-center justify-center group">
                    <User className="w-20 h-20 text-gold-500/20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 border-4 border-white/20 rounded-[3rem]"></div>
                </div>
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-emerald-950/5"
                >
                    <Shield className="w-6 h-6 text-emerald-900" />
                </motion.div>
             </div>

             <div className="space-y-4">
                <h1 className="text-5xl font-display text-emerald-950">{user?.name}</h1>
                <p className="text-emerald-900/40 font-bold uppercase tracking-[0.3em] text-xs">Verified Guardian Since 2026</p>
             </div>

             <div className="pt-10 border-t border-emerald-900/5 space-y-6">
                <div className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-12 h-12 bg-emerald-900/5 rounded-2xl flex items-center justify-center group-hover:bg-emerald-950 group-hover:text-gold-500 transition-all">
                        <Heart className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-emerald-950 uppercase tracking-widest">Legend List</p>
                        <p className="text-xs text-emerald-900/40 font-medium">12 Saved Traditions</p>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-emerald-900/20" />
                </div>
                <div className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-12 h-12 bg-emerald-900/5 rounded-2xl flex items-center justify-center group-hover:bg-emerald-950 group-hover:text-gold-500 transition-all">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-emerald-950 uppercase tracking-widest">Followed Regions</p>
                        <p className="text-xs text-emerald-900/40 font-medium">4 Districts Tracked</p>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-emerald-900/20" />
                </div>
             </div>
          </div>

          {/* Right Column: Identity & Interests */}
          <div className="lg:col-span-8 space-y-16">
             <section className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-emerald-950/5 border border-emerald-950/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Sparkles className="w-40 h-40 text-emerald-950" />
                </div>
                
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-display text-emerald-950 italic">Personal <span className="text-gold-600">Identity.</span></h2>
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs tracking-widest uppercase transition-all ${isEditing ? 'bg-gold-500 text-emerald-950 shadow-xl' : 'bg-emerald-900/5 text-emerald-900 hover:bg-emerald-950 hover:text-gold-500'}`}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <><Save className="w-4 h-4" /> Save Legend</> : 'Edit Profile'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/20 group-focus-within:text-gold-600" />
                            <input 
                                disabled={!isEditing}
                                className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-gold-500/50 rounded-2xl py-4 pl-14 pr-6 text-emerald-950 font-medium transition-all disabled:opacity-60"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] ml-1">Guardian Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/20" />
                            <input 
                                disabled={true}
                                className="w-full bg-emerald-900/5 border-transparent rounded-2xl py-4 pl-14 pr-6 text-emerald-900/30 font-medium cursor-not-allowed"
                                value={formData.email}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] ml-1">Contact Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/20 group-focus-within:text-gold-600" />
                            <input 
                                disabled={!isEditing}
                                className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-gold-500/50 rounded-2xl py-4 pl-14 pr-6 text-emerald-950 font-medium transition-all disabled:opacity-60"
                                placeholder="+91 00000 00000"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
             </section>

             <section className="space-y-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-display text-emerald-950">Cultural <span className="text-gold-600 italic">Interests.</span></h2>
                    <p className="text-emerald-900/40 font-medium italic leading-relaxed">Select the threads of heritage that move your soul. We'll use these to curate your experience.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    {CATEGORIES.map((cat) => {
                        const isSelected = formData.interests.includes(cat);
                        return (
                            <button
                                key={cat}
                                onClick={() => handleInterestToggle(cat)}
                                className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                                    isSelected 
                                    ? 'bg-emerald-950 text-gold-500 shadow-xl shadow-emerald-950/20' 
                                    : 'bg-white border border-emerald-900/5 text-emerald-950/60 hover:border-gold-500/30'
                                }`}
                            >
                                {isSelected && <Check className="w-3 h-3" />}
                                {cat}
                            </button>
                        );
                    })}
                </div>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
