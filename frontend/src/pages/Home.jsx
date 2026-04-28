import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import { ArrowRight, CalendarX, Map as MapIcon, Grid, ScrollText, Sparkles, Plus, Check, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import EventCard from '../components/EventCard';
import PlaceCard from '../components/PlaceCard';
import EventFilter from '../components/EventFilter';
import EventMap from '../components/EventMap';
import { EventCardSkeleton } from '../components/Skeleton';
import usePrefetch from '../hooks/usePrefetch';
import api from '../services/api';
import { Helmet } from 'react-helmet-async';

import { useWishlist } from '../context/WishlistContext';


import { Link } from 'react-router-dom';

const Home = () => {
  const { followedDistricts, toggleDistrictFollow } = useWishlist();

  const { isLoggedIn } = useAuth();
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const { prefetchEvent } = usePrefetch();

  // Parallax scroll configuration — window-based (no target = no container warning)
  const { scrollYProgress } = useScroll();

  // Parallax transforms — mapped to first 20% of page scroll for hero effect
  const imageY = useTransform(scrollYProgress, [0, 0.2], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 0.2], ['0%', '-20%']);
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0.8, 0.9, 1]);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [eventsRes, placesRes] = await Promise.all([
          api.get('/events'),
          api.get('/places')
        ]);
        setAllEvents(eventsRes.data.data);
        setEvents(eventsRes.data.data);
        setPlaces(placesRes.data.data);
      } catch {
        setError('Could not load heritage data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleFilterChange = async (newFilters) => {
    setLoading(true);
    try {
      // Fix P1: Use backend text index instead of client-side JS filter
      const params = new URLSearchParams();
      if (newFilters.district) params.append('district', newFilters.district);
      if (newFilters.date) params.append('date', newFilters.date);
      if (newFilters.search) params.append('search', newFilters.search);

      const hasFilter = newFilters.district || newFilters.date || newFilters.search;
      if (hasFilter) {
        const response = await api.get(`/events/filter?${params}`);
        setEvents(response.data.data);
      } else {
        setEvents(allEvents); // Reset to cached full list
      }
    } catch {
      setError('Filter failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  // Handle prefetch on EventCard hover for instant navigation
  const handleEventHover = (eventId) => {
    prefetchEvent(eventId);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40 overflow-hidden relative">

      <Helmet>
        <title>LiveKeralam | God's Own Events & Heritage</title>
        <meta name="description" content="Discover exclusive cultural festivals, sacred rituals, and hidden heritage spots across Kerala." />
      </Helmet>
      {/* Editorial Hero Section with Parallax */}
      <motion.section
        className="relative h-screen min-h-[900px] flex items-center overflow-hidden bg-emerald-950"
        style={{ gradientOpacity }}
      >

        <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
          <img
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover scale-105"
            alt="Kerala Backwaters"
            loading="lazy"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-transparent to-emerald-900/10"
            style={{ opacity: gradientOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/40 to-transparent"></div>
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto px-6 relative z-10 w-full"
          style={{ y: textY }}
        >
          <div className="max-w-4xl space-y-12">
            {/* Split-Text Animation for Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-6 text-gold-500"
            >
              <div className="h-[2px] w-20 bg-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
              <span className="text-xs font-black uppercase tracking-[0.6em]">The Soul of God's Own Country</span>
            </motion.div>

            {/* Split-Text Character Animation */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-7xl md:text-[9rem] font-display font-medium text-white leading-[0.85] tracking-tighter"
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block"
              >
                Live
              </motion.span>{' '}
              <br />
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="italic text-gold-500 font-light pr-8 inline-block"
              >
                Keralam
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="max-w-xl space-y-8"
            >
              <p className="text-2xl text-white/80 leading-relaxed font-light italic">
                From the misty ghats of Wayanad to the golden sands of Varkala, discover the heart of Kerala's heritage.
              </p>

              <div className="flex items-center gap-10 pt-4">
                <motion.button
                  onClick={() => document.getElementById('events').scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-gold-500 text-emerald-950 rounded-2xl font-black text-xs tracking-[0.3em] shadow-2xl shadow-gold-500/30 group flex items-center gap-3"
                >
                  START EXPLORING <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <div className="flex items-center gap-4 text-white/30 cursor-pointer hover:text-gold-500 transition-colors group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold-500/50 transition-all">
                    <ScrollText className="w-6 h-6 border-b-2 border-transparent group-hover:scale-110 transition-all" />
                  </div>
                  <span className="text-xs font-black tracking-[0.4em] uppercase">Scroll Traditions</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Accent with subtle animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 right-12 z-10 hidden xl:block"
        >
          <div className="flex flex-col items-center gap-4 text-gold-500/20">
            <span className="[writing-mode:vertical-rl] text-xs font-black tracking-[1em] uppercase">Est. 2026</span>
            <div className="w-px h-24 bg-gradient-to-b from-gold-500/20 to-transparent"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* 2. TRENDING LIVE HERITAGE (Social Proof) */}
      <section className="bg-emerald-950 py-10 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-xs font-black text-white/50 uppercase tracking-[0.3em]">Trending Live Heritage</span>
          </div>
          <span className="text-xs font-bold text-gold-500/60 uppercase tracking-widest cursor-pointer hover:text-gold-500 transition-colors">See all live events</span>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="flex gap-8 px-6 overflow-x-auto no-scrollbar pb-10">
          {events.slice(0, 4).map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[300px] md:min-w-[400px] group cursor-pointer"
            >
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-4 ring-1 ring-white/10 group-hover:ring-gold-500/50 transition-all shadow-2xl">
                <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[9px] font-black bg-gold-500 text-emerald-950 px-3 py-1 rounded-full uppercase mb-2 inline-block">Featured Today</span>
                  <h4 className="text-xl font-display text-white">{event.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                    <MapIcon className="w-3 h-3" /> {event.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. MODERN FILTER INTEGRATION */}
      <section className="max-w-5xl mx-auto px-4 -mt-16 relative z-30">
        <EventFilter onFilterChange={handleFilterChange} allEvents={allEvents} />
      </section>

      {/* NEW: Heritage Highlights Section (Adds Depth) */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-white rounded-[3rem] shadow-xl shadow-emerald-900/5 border border-emerald-900/5 hover:scale-105 transition-transform"
          >
            <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-8">
              <ScrollText className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="text-2xl font-display text-emerald-950 mb-4">Vibrant Festivals</h3>
            <p className="text-emerald-900/60 leading-relaxed font-medium">Witness the color and energy of Kerala's temple festivals, featuring spectacular percussion and costumed dancers.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-10 bg-white rounded-[3rem] shadow-xl shadow-emerald-900/5 border border-emerald-900/5 hover:scale-105 transition-transform"
          >
            <div className="w-16 h-16 bg-emerald-900/10 rounded-2xl flex items-center justify-center mb-8">
              <MapIcon className="w-8 h-8 text-emerald-800" />
            </div>
            <h3 className="text-2xl font-display text-emerald-950 mb-4">Hidden Trails</h3>
            <p className="text-emerald-900/60 leading-relaxed font-medium">Explore heritage spots away from the crowds—from ancient rock-cut temples to colonial architecture.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-10 bg-white rounded-[3rem] shadow-xl shadow-emerald-900/5 border border-emerald-900/5 hover:scale-105 transition-transform"
          >
            <div className="w-16 h-16 bg-gold-600/10 rounded-2xl flex items-center justify-center mb-8">
              <Sparkles className="w-8 h-8 text-gold-700" />
            </div>
            <h3 className="text-2xl font-display text-emerald-950 mb-4">Sacred Rituals</h3>
            <p className="text-emerald-900/60 leading-relaxed font-medium">Experience authentic art forms like Theyyam and Kathakali, preserving centuries of oral and physical traditions.</p>
          </motion.div>
        </div>
      </section>

      {/* 3. VIBRANT CATEGORIES (Curated Exploration) */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-6xl font-display text-emerald-950">Curated <br /> <span className="text-gold-600 italic">Essence.</span></h2>
            <p className="text-emerald-900/60 font-medium">Browse by the cultural thread that moves you.</p>
          </div>
          <div className="h-20 w-px bg-emerald-900/10 hidden md:block"></div>
          <p className="max-w-sm text-sm text-emerald-900/40 italic font-medium leading-relaxed">From the rhythmic thumps of temple drums to the silent whispers of ancient scripts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Temple Festivals', img: 'https://images.unsplash.com/photo-1621614275066-51f7d5448378?auto=format&fit=crop&q=80&w=600' },
            { name: 'Sacred Rituals', img: 'https://images.unsplash.com/photo-1596443329712-4f7f2b60453e?auto=format&fit=crop&q=80&w=600' },
            { name: 'Art Forms', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600' },
            { name: 'Heritage Sites', img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600' }
          ].map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl shadow-emerald-900/5"
            >
              <img src={cat.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 saturate-[0.8] group-hover:saturate-100" alt={cat.name} loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute bottom-10 left-10">
                <h4 className="text-2xl font-display text-white">{cat.name}</h4>
                <div className="w-10 h-1 bg-gold-500 mt-4 group-hover:w-20 transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. EXPLORE BY DISTRICT (Visual Navigation) */}

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
          <h2 className="text-5xl font-display text-emerald-950">Explore by <span className="text-gold-600 italic">Region.</span></h2>
          <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-xs">14 Districts | Infinite Stories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Malappuram', 'Kannur', 'Palakkad', 'Alappuzha', 'Kollam', 'Wayanad', 'Idukki', 'Kasargod', 'Kottayam', 'Pathanamthitta'].map((district, i) => {

            const isFollowing = followedDistricts.includes(district);
            return (
              <motion.div
                key={district}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group cursor-pointer relative"
              >
                <div
                  onClick={() => handleFilterChange({ district })}
                  className={`bg-white border p-6 rounded-[2rem] flex flex-col items-center gap-4 shadow-xl shadow-emerald-900/5 group-hover:bg-emerald-950 group-hover:border-gold-500/30 transition-all ${isFollowing ? 'border-gold-500/30 bg-emerald-900/5' : 'border-emerald-900/5'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isFollowing ? 'bg-gold-500 text-emerald-950' : 'bg-emerald-900/5 text-emerald-900 group-hover:bg-gold-500 group-hover:text-emerald-950'}`}>
                    <MapPin className="w-5 h-5 transition-colors" />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest text-center ${isFollowing ? 'text-gold-500' : 'text-emerald-950 group-hover:text-white'}`}>{district}</span>
                </div>

                {/* Quick Follow Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDistrictFollow(district);
                  }}
                  className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border transition-all z-10 ${isFollowing ? 'bg-gold-500 border-gold-500 text-emerald-950 shadow-lg shadow-gold-500/40' : 'bg-white border-emerald-900/10 text-emerald-900 opacity-0 group-hover:opacity-100 hover:scale-110'}`}
                >
                  {isFollowing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* 5. HERITAGE MATCHMAKER (Personalized Discovery Mockup) */}

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-heritage-gradient rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Sparkles className="w-full h-full text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="flex items-center gap-4">
              <span className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black text-gold-500 uppercase tracking-widest border border-white/10">Heritage Matchmaker Engine</span>
            </div>
            <h2 className="text-5xl font-display text-white leading-tight">Your personality, <br /> <span className="text-gold-500 italic">matched with heritage.</span></h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed">Our intelligence tool analyzes your cultural curiosity to recommend experiences that resonate with your preferences. From silent temple mornings to vibrant ritual chants.</p>
            <button className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-xl">Activate Matchmaker</button>
          </div>
        </div>
      </section>

      {/* 5. TRENDING EVENTS GRID (Visible to all, limited for guests) */}
      <section id="events" className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 border-b border-emerald-900/10 pb-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em]">Heritage Calendar</span>
            <h2 className="text-6xl font-display font-medium text-emerald-950">
              Upcoming <br /> <span className="text-gold-600 italic">Traditions.</span>
            </h2>
            <p className="text-emerald-900/60 font-medium">Verified by our heritage experts in {new Date().getFullYear()}</p>
          </div>

          {/* View Toggler */}
          <div className="flex p-2 bg-emerald-900/5 rounded-2xl w-fit self-start md:self-auto ring-1 ring-emerald-900/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all font-black text-xs tracking-widest uppercase ${viewMode === 'grid'
                ? 'bg-emerald-900 text-gold-500 shadow-xl'
                : 'text-emerald-950/60 hover:text-emerald-950'
                }`}
            >
              <Grid className="w-4 h-4" /> Gridview
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all font-black text-xs tracking-widest uppercase ${viewMode === 'map'
                ? 'bg-emerald-900 text-gold-500 shadow-xl'
                : 'text-emerald-950/60 hover:text-emerald-950'
                }`}
            >
              <MapIcon className="w-4 h-4" /> Mapview
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {[1, 2, 3].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-12 rounded-[3rem] text-center max-w-xl mx-auto border border-red-100">
            <h4 className="font-display text-2xl mb-4">Connection interrupted</h4>
            <p className="opacity-70 font-medium">{error}</p>
          </div>
        ) : events.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="space-y-32">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                {(isLoggedIn ? events : events.slice(0, 3)).map((event) => (
                  <div key={event._id} onMouseEnter={() => handleEventHover(event._id)}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {!isLoggedIn && (
                <div className="mt-20 p-12 bg-emerald-950 rounded-[4rem] text-center border border-gold-500/20 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-heritage-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative z-10 space-y-8">
                    <h3 className="text-4xl font-display text-white italic">Unlock the full <span className="text-gold-500">Legend.</span></h3>
                    <p className="text-white/40 max-w-xl mx-auto font-medium text-lg italic">
                      There are {events.length - 3} more sacred festivals and cultural gatherings waiting for you. Join our exclusive community to see the full heritage calendar.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                      <Link to="/register" className="px-10 py-5 bg-gold-500 text-emerald-950 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-xl">Establish Membership</Link>
                      <Link to="/login" className="px-10 py-5 border-2 border-white/20 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-white/10 transition-all">Guardian Login</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000 overflow-hidden rounded-[3rem] ring-8 ring-white shadow-2xl">
              <EventMap events={events} />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-10 bg-emerald-900/5 rounded-[4rem] border-2 border-dashed border-emerald-900/10">
            <CalendarX className="w-20 h-20 text-emerald-900/20" />
            <div className="space-y-3">
              <h3 className="text-4xl font-display text-emerald-900">No events found</h3>
              <p className="text-emerald-900/50 max-w-sm mx-auto font-medium">
                The traditions you're looking for aren't scheduled yet. Try adjusting your search.
              </p>
            </div>
            <button
              onClick={() => handleFilterChange({ district: '', date: '', search: '' })}
              className="bg-emerald-900 text-gold-500 px-10 py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-emerald-950 transition-all shadow-xl"
            >
              RESET JOURNEY
            </button>
          </div>
        )}
      </section>

      {/* Gated Member Content */}
      {isLoggedIn ? (
        <>
          {/* 6. VOICES FROM THE TRAIL (Trust & Community) */}
          <section className="bg-white py-32">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-4 mb-24">
                <span className="text-xs font-black text-gold-600 uppercase tracking-[0.4em]">Community Pulse</span>
                <h2 className="text-6xl font-display text-emerald-950">Shared <br className="md:hidden" /> <span className="text-gold-600 italic">Experiences.</span></h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Sarah Miller', role: 'Adventure Photographer', quote: 'Seeing Theyyam in a village temple was a spiritual awakening. LiveKeralam made it possible to find the exact time and place.' },
                  { name: 'Arjun Nair', role: 'Heritage Architect', quote: 'Finally, a platform that respects the weight of our traditions and presents them with such high-fidelity detail.' },
                  { name: 'Elena Petrova', role: 'Cultural Traveler', quote: 'The interactive map and real-time alerts are a game changer. I felt like a local discovery legend every single day.' }
                ].map((testimonial, i) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-12 bg-[#F9FAFB] rounded-[4rem] border border-emerald-900/5 relative group hover:bg-emerald-950 transition-all duration-500"
                  >
                    <div className="absolute top-10 right-10">
                      <Sparkles className="w-6 h-6 text-gold-500/20 group-hover:text-gold-500 transition-colors" />
                    </div>
                    <p className="text-xl text-emerald-900/70 group-hover:text-white/60 mb-10 font-light italic leading-relaxed transition-colors">"{testimonial.quote}"</p>
                    <div className="space-y-1">
                      <h5 className="font-display text-2xl text-emerald-950 group-hover:text-white transition-colors">{testimonial.name}</h5>
                      <p className="text-xs font-black text-gold-600 uppercase tracking-widest">{testimonial.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. PARTNER WITH US */}
          <section className="bg-emerald-950 py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <h2 className="text-6xl font-display text-white leading-tight">Bring your <br /> <span className="text-gold-500 italic">tradition online.</span></h2>
                <p className="text-white/60 text-xl font-light italic leading-relaxed uppercase tracking-widest max-w-md">Join hundreds of heritage experts and temple committees sharing their legends with the world.</p>

                <div className="space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-gold-500" />
                    </div>
                    <span className="text-white/80 font-medium tracking-wide">Publish your local festivals.</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-gold-500" />
                    </div>
                    <span className="text-white/80 font-medium tracking-wide">Connect with global travelers.</span>
                  </div>
                </div>
                <Link to="/contact" className="inline-block px-12 py-6 border-2 border-gold-500 text-gold-500 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-gold-500 hover:text-emerald-950 transition-all">Submit Your Legend</Link>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square md:aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl ring-1 ring-white/20"
              >
                <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-40" alt="Culture" loading="lazy" />
                <div className="absolute inset-0 bg-emerald-950/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 text-emerald-950" />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        <section className="bg-white py-32 text-center">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-900/5 rounded-full text-[10px] font-black text-emerald-900 uppercase tracking-widest border border-emerald-900/10">
                <Sparkles className="w-4 h-4 text-gold-600" /> Member Exclusive Content Gated
             </div>
             <h2 className="text-6xl font-display text-emerald-950">Unlock the <span className="text-gold-600 italic">Rest of the Journey.</span></h2>
             <p className="text-emerald-900/60 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
               Our full suite of cultural discovery tools, interactive heritage maps, and upcoming festival schedules are reserved for registered explorers.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
                <Link to="/register" className="px-12 py-6 bg-emerald-950 text-white rounded-[2rem] font-black text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-2xl">Get Full Access</Link>
                <div className="h-px w-20 bg-emerald-900/10 hidden sm:block"></div>
                <Link to="/login" className="text-emerald-950 font-black text-xs tracking-widest uppercase hover:text-gold-600 transition-colors">Explorer Sign In</Link>
             </div>
          </div>
        </section>
      )}
    </div>
  );
};


export default Home;
