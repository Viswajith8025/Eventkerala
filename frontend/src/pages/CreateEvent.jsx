import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, MapPin, Calendar, ScrollText, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        district: '',
        date: '',
        location: '',
        category: 'Temple Festivals',
        price: 0,
        bookingLink: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            return toast.error('A visual chronicle is required. Please upload an image.', {
                style: { background: '#991b1b', color: '#fff', borderRadius: '1rem' }
            });
        }
        setLoading(true);
        try {
            const response = await api.post('/events', formData);
            if (response.data.success) {
                toast.success('Tradition submitted for moderation', {
                    style: { background: '#064e3b', color: '#fff', borderRadius: '1rem' }
                });
                setSuccess(true);
                setTimeout(() => navigate('/'), 3000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center space-y-8 shadow-2xl"
                >
                    <div className="w-24 h-24 bg-emerald-900/5 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-12 h-12 text-emerald-900" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-display text-emerald-950">Awaiting Ritual.</h2>
                        <p className="text-emerald-900/60 font-medium">Your submission is being verified by our heritage curators. You will be notified once it goes live.</p>
                    </div>
                    <button onClick={() => navigate('/')} className="w-full py-5 bg-emerald-900 text-gold-500 rounded-2xl font-black text-xs tracking-widest uppercase">Return Home</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-40">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
                    <div className="space-y-4">
                        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.4em]">Submission Portal</span>
                        <h1 className="text-7xl font-display text-emerald-950 leading-none">Publish a <br /><span className="text-gold-600 italic">Legend.</span></h1>
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-emerald-900/5 rounded-[2rem] border border-emerald-900/10">
                        <AlertCircle className="w-6 h-6 text-emerald-900" />
                        <p className="text-xs text-emerald-900/60 font-bold max-w-[200px] leading-relaxed uppercase tracking-wider">All submissions undergo strict authentic verification.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-10">
                        {/* Title & Basics */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-display text-emerald-950 flex items-center gap-3">
                                <ScrollText className="w-5 h-5 text-gold-500" /> Core Essence
                            </h3>
                            <div className="space-y-4">
                                <input 
                                    name="title"
                                    placeholder="Name of the Tradition (e.g., Arattupuzha Pooram)" 
                                    required
                                    onChange={handleChange}
                                    className="w-full bg-white border border-emerald-900/5 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-gold-500/50 shadow-xl shadow-emerald-900/5" 
                                />
                                    <input 
                                        name="bookingLink"
                                        placeholder="Booking Portal URL (Optional)" 
                                        onChange={handleChange}
                                        className="w-full bg-white border border-emerald-900/5 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-gold-500/50 shadow-xl shadow-emerald-900/5" 
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <select 
                                            name="category"
                                            onChange={handleChange}
                                            className="bg-white border border-emerald-900/5 rounded-2xl px-6 py-5 text-sm text-emerald-950/60 font-medium"
                                        >
                                            <option>Temple Festivals</option>
                                            <option>Sacred Rituals</option>
                                            <option>Art Forms</option>
                                            <option>Heritage Sites</option>
                                        </select>
                                        <input 
                                            name="price"
                                            type="number"
                                            placeholder="Entry Fee (0 for Free)" 
                                            onChange={handleChange}
                                            className="bg-white border border-emerald-900/5 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-gold-500/50 shadow-xl shadow-emerald-900/5" 
                                        />
                                    </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-display text-emerald-950 flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gold-500" /> Sacred Geography
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                               <input 
                                    name="district"
                                    placeholder="District" 
                                    required
                                    onChange={handleChange}
                                    className="bg-white border border-emerald-900/5 rounded-2xl px-8 py-5 text-sm" 
                                />
                               <input 
                                    name="date"
                                    type="date" 
                                    required
                                    onChange={handleChange}
                                    className="bg-white border border-emerald-900/5 rounded-2xl px-8 py-5 text-sm" 
                                />
                            </div>
                            <input 
                                name="location"
                                placeholder="Exact Temple/Venue Location" 
                                required
                                onChange={handleChange}
                                className="w-full bg-white border border-emerald-900/5 rounded-2xl px-8 py-5 text-sm shadow-xl shadow-emerald-900/5" 
                            />
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Narrative */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-display text-emerald-950 flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-gold-500" /> The Story
                            </h3>
                            <textarea 
                                name="description"
                                rows="8"
                                placeholder="Describe the heritage, history, and unique rituals associated with this event..." 
                                required
                                onChange={handleChange}
                                className="w-full bg-white border border-emerald-900/5 rounded-[2rem] px-8 py-8 text-sm focus:outline-none focus:border-gold-500/50 shadow-xl shadow-emerald-900/5 resize-none"
                            ></textarea>
                        </div>

                        {/* Functional Image Upload */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-display text-emerald-950 flex items-center gap-3">
                                <Upload className="w-5 h-5 text-gold-500" /> Visual Archive
                            </h3>
                            <ImageUpload 
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-8 bg-emerald-950 text-gold-500 rounded-[2rem] font-black text-[12px] tracking-[0.4em] uppercase shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? 'MODERATING...' : 'SUBMIT RECKONING'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
