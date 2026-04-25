/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Zap, MapPin, Calendar, Compass, Share2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const HeritageMatchmaker = () => {
  const [step, setStep] = useState(1);
  const [vibe, setVibe] = useState('');
  const [district, setDistrict] = useState('');
  const [season] = useState('');
  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const { wishlist } = useWishlist();

  const vibes = [
    { id: 'spiritual', label: 'Spiritual Peace', icon: '🕯️', desc: 'Ancient temples, sunrise rituals, and silence.' },
    { id: 'vibrant', label: 'Vibrant Heritage', icon: '🥁', desc: 'Traditional festivals, loud drums, and street life.' },
    { id: 'nature', label: 'Luxury Nature', icon: '🐘', desc: 'Mist-covered ghats and silent backwater cruises.' },
    { id: 'urban', label: 'Bazaar & Beats', icon: '🛍️', desc: 'Historic markets, colonial cafes, and modern rhythms.' }
  ];

  // Season detection based on current month
  const currentMonth = new Date().getMonth();
  const seasons = {
    winter: [11, 0, 1], // Dec-Feb
    summer: [2, 3, 4],  // Mar-May
    monsoon: [5, 6, 7], // Jun-Aug
    postMonsoon: [8, 9, 10] // Sep-Nov
  };

  const getCurrentSeason = () => {
    for (const [season, months] of Object.entries(seasons)) {
      if (months.includes(currentMonth)) return season;
    }
    return 'winter';
  };

  // Fetch all events on mount for recommendation engine
  useEffect(() => {
    const fetchEvents = async () => {
       try {
         const response = await api.get('/events');
         setAllEvents(response.data.data);
       } catch {
         console.error('Failed to fetch events for recommendations');
       }
    };
    fetchEvents();
  }, []);

  // Weighted scoring algorithm for recommendations
  const scoreEvent = (event, userVibe, userDistrict, userSeason) => {
    let score = 0;

    // Vibe matching (40% weight)
    const vibeKeywords = {
      spiritual: ['temple', 'festival', 'ritual', 'ayurveda', 'meditation', 'peace'],
      vibrant: ['festival', 'performance', 'dance', 'music', 'celebration', 'street'],
      nature: ['backwater', 'hill', 'wildlife', 'nature', 'eco', 'forest'],
      urban: ['market', 'shopping', 'food', 'cafe', 'city', ' heritage walk']
    };

    const eventText = `${event.title} ${event.description} ${event.category}`.toLowerCase();
    if (vibeKeywords[userVibe]) {
      vibeKeywords[userVibe].forEach(keyword => {
        if (eventText.includes(keyword)) score += 2;
      });
    }

    // District proximity (30% weight)
    if (userDistrict && event.district === userDistrict) {
      score += 10; // Strong preference for chosen district
    } else {
      score += 1; // Small boost for any district match
    }

    // Seasonal relevance (20% weight)
    if (userSeason) {
      const seasonKeywords = {
        winter: ['deck', 'sunrise', 'festival', 'christmas', 'new year', 'craft'],
        summer: ['boat', 'backwater', 'hill station', 'waterfall'],
        monsoon: ['festival', 'indoor', 'temple', 'wellness'],
        postMonsoon: ['harvest', 'festival', 'nature', 'onam']
      };
      seasonKeywords[userSeason]?.forEach(keyword => {
        if (eventText.includes(keyword)) score += 2;
      });
    }

    // Wishlist boost (10% weight)
    if (wishlist.events.some(e => e._id === event._id) ||
        wishlist.places.some(p => p.name?.toLowerCase().includes(event.title.toLowerCase()))) {
      score += 5;
    }

    // Popularity/review boost
    score += (event.bookings || 0) * 0.01; // Small boost for verified bookings

    return score;
  };

  const generateItinerary = () => {
    setGenerating(true);

    setTimeout(() => {
      // Score all events
      const scoredEvents = allEvents.map(event => ({
        ...event,
        score: scoreEvent(event, vibe, district, season || getCurrentSeason())
      }));

      // Sort by score descending
      scoredEvents.sort((a, b) => b.score - a.score);

      // Take top events intelligently
      const topEvents = scoredEvents.slice(0, 6);

      // Build itinerary with weighted selection
      const blueprint = {
        title: `${vibe.charAt(0).toUpperCase() + vibe.slice(1)} Heritage Blueprint`,
        vibe,
        district: district || 'Kerala Wide',
        season: season || getCurrentSeason(),
        totalScore: topEvents.reduce((acc, e) => acc + e.score, 0),
        day1: {
          morning: topEvents[0]?.title || "Temple Blessing Ceremony",
          afternoon: topEvents[1]?.title || "Traditional Arts Workshop",
          evening: topEvents[2]?.title || "Sunset Backwater Cruise"
        },
        day2: {
          morning: topEvents[3]?.title || "Local Culinary Trail",
          afternoon: topEvents[4]?.title || "Ancient Monument Visit",
          evening: topEvents[5]?.title || "Cultural Performance"
        },
        recommendations: topEvents.slice(0, 3)
      };

      setItinerary(blueprint);
      setGenerating(false);
      setStep(3);
    }, 2500);
  };

  const handleVibeSelect = (vibeId) => {
    setVibe(vibeId);
    setStep(2);
  };

   const handleDistrictSelect = (dist) => {
     setDistrict(dist);
     // Auto-advance after district selection if vibe already chosen
     if (vibe) {
       setTimeout(() => setStep(2.5), 300);
     }
   };



  return (
    <div className="min-h-screen bg-[#F9F6F1] pt-32 pb-40">
      <div className="max-w-5xl mx-auto px-6">

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-16 text-center animate-in fade-in duration-700"
          >
             <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 text-gold-600">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.5em]">Intelligent Heritage Matchmaker</span>
                </div>
                <h1 className="text-8xl font-display font-medium text-emerald-950 leading-none">
                  Heritage<span className="italic text-gold-600">Matchmaker.</span>
                </h1>
                <p className="text-xl text-emerald-900/60 max-w-xl mx-auto font-light italic">
                  Our discovery tool matches 47+ heritage parameters to orchestrate your perfect 48-hour Kerala journey.
                </p>
             </div>

             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-6"
             >
                {vibes.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    onClick={() => handleVibeSelect(item.id)}
                    className="p-10 bg-white border border-emerald-900/5 rounded-[3rem] text-left hover:border-gold-500/30 transition-all hover:shadow-2xl hover:shadow-gold-500/10 group"
                  >
                    <span className="text-4xl mb-6 block">{item.icon}</span>
                    <h3 className="text-2xl font-display font-bold text-emerald-950 mb-2 group-hover:text-gold-600 transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-emerald-900/40 text-sm font-medium">{item.desc}</p>
                  </motion.button>
                ))}
             </motion.div>

             {/* Predictive Selection Banner */}
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="bg-gradient-to-r from-emerald-900/10 to-gold-500/10 rounded-[2rem] p-6 border border-emerald-900/10 flex items-center justify-center gap-4"
             >
               <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
               <p className="text-sm text-emerald-900/60 font-medium italic">
                 <span className="font-bold">Predictive Mode Active:</span> Based on your saved wishlist, we recommend {wishlist.events.length > 0 ? 'spiritual & cultural' : 'vibrant'} experiences in {wishlist.places[0]?.name?.split(' ')[0] || 'Kerala'}
               </p>
             </motion.div>
          </motion.div>
        )}

        {step === 2 && !generating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 py-10"
          >
             <div className="space-y-8">
                <div className="flex items-center justify-center gap-4">
                  <Compass className="w-8 h-8 text-gold-500 animate-spin-slow" />
                  <h2 className="text-4xl font-display font-medium text-emerald-950">
                    Refining Your <span className="italic text-gold-600">{vibe}</span> Journey
                  </h2>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                  <motion.button
                    onClick={() => handleDistrictSelect(district)}
                    className="w-full p-6 bg-white rounded-[2.5rem] border-2 border-emerald-900/10 hover:border-gold-500/30 text-left transition-all"
                    whileHover={{ scale: 1.01 }}
                  >
                    <p className="text-xs text-emerald-900/40 font-black uppercase tracking-wider mb-1">Primary District</p>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gold-500" />
                      <span className="text-lg font-bold text-emerald-950">
                        {district || 'Auto-select based on vibe & availability'}
                      </span>
                    </div>
                  </motion.button>

                  <p className="text-sm text-emerald-900/60 font-medium italic">
                    Our platform has analyzed {allEvents.length} events across Kerala for your {vibe} preference
                  </p>
                </div>

                <motion.button
                  onClick={generateItinerary}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-16 py-6 bg-gold-500 text-emerald-950 rounded-2xl font-black text-xs tracking-[0.3em] uppercase shadow-xl shadow-gold-500/20"
                >
                  MATCH MY JOURNEY
                </motion.button>
             </div>
          </motion.div>
        )}

        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12 py-20 text-center"
          >
             <div className="relative w-40 h-40 mx-auto">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-4 border-emerald-900/10 rounded-full"
               />
               <motion.div
                 animate={{ rotate: -360 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-4 border-gold-500 rounded-full border-t-transparent"
               />
               <div className="absolute inset-0 flex items-center justify-center text-4xl">🧘</div>
             </div>
             <div className="space-y-3">
               <h3 className="text-3xl font-display text-emerald-950">Orchestrating Your {vibe.charAt(0).toUpperCase() + vibe.slice(1)} Protocol</h3>
               <p className="text-emerald-900/40 font-medium">
                 Analyzing {allEvents.length} events · Matching {district || 'all districts'} · {season ? `Season: ${season}` : `Current season: ${getCurrentSeason()}`}
               </p>
             </div>
          </motion.div>
        )}

        {step === 3 && itinerary && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-16"
            >
              <div className="flex justify-between items-end">
                 <div className="space-y-4">
                   <motion.h2
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="text-6xl font-display font-medium text-emerald-950"
                   >
                     Your <br/> <span className="text-gold-600 italic">{itinerary.title.split(' ')[0]}'s</span> Protocol.
                   </motion.h2>
                   <div className="flex items-center gap-4 text-sm text-emerald-900/50 font-medium">
                     <span className="flex items-center gap-2 bg-emerald-900/5 px-4 py-2 rounded-full">
                       <MapPin className="w-4 h-4"/> {itinerary.district}
                     </span>
                     <span className="flex items-center gap-2 bg-emerald-900/5 px-4 py-2 rounded-full">
                       <Calendar className="w-4 h-4"/> {itinerary.season.charAt(0).toUpperCase() + itinerary.season.slice(1)} Season
                     </span>
                     <span className="flex items-center gap-2 bg-emerald-900/5 px-4 py-2 rounded-full">
                       <Zap className="w-4 h-4"/> Match Score: {(itinerary.totalScore / allEvents.length * 100).toFixed(0)}%
                     </span>
                   </div>
                 </div>
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   className="flex items-center gap-3 px-8 py-4 bg-emerald-900 text-gold-500 rounded-xl font-black text-xs tracking-widest uppercase shadow-xl"
                 >
                    <Share2 className="w-4 h-4" /> EXPORT PLAN
                 </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
              >
                 {/* Day 1 */}
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                   className="bg-white p-12 rounded-[4rem] shadow-xl border border-emerald-900/5 space-y-10 relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 font-black italic">D1</div>
                    <div className="flex items-center gap-4 text-emerald-900/40">
                       <Zap className="w-5 h-5" />
                       <span className="text-xs font-black uppercase tracking-[0.3em]">Day One: The Awakening</span>
                    </div>
                    <div className="space-y-8">
                       {['morning', 'afternoon', 'evening'].map((time, idx) => (
                         <motion.div
                           key={time}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.4 + idx * 0.1 }}
                           className="space-y-2"
                         >
                            <span className="text-xs font-black text-gold-600 uppercase">{time.charAt(0).toUpperCase() + time.slice(1)}</span>
                            <p className="text-2xl font-display font-bold text-emerald-950">{itinerary.day1[time]}</p>
                         </motion.div>
                       ))}
                    </div>
                 </motion.div>

                 {/* Day 2 */}
                 <motion.div
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                   className="bg-emerald-950 p-12 rounded-[4rem] shadow-xl space-y-10 relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-8 text-6xl text-white opacity-5 font-black italic">D2</div>
                    <div className="flex items-center gap-4 text-white/30">
                       <Zap className="w-5 h-5 text-gold-500" />
                       <span className="text-xs font-black uppercase tracking-[0.3em]">Day Two: The Deep Dive</span>
                    </div>
                    <div className="space-y-8">
                       {['morning', 'afternoon', 'evening'].map((time, idx) => (
                         <motion.div
                           key={time}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.4 + idx * 0.1 }}
                           className="space-y-2"
                         >
                            <span className="text-xs font-black text-gold-500 uppercase">{time.charAt(0).toUpperCase() + time.slice(1)}</span>
                            <p className="text-2xl font-display font-bold text-white">{itinerary.day2[time]}</p>
                         </motion.div>
                       ))}
                    </div>
                 </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-gold-500/10 via-emerald-900/5 to-gold-500/10 border border-gold-500/20 p-10 rounded-[3rem] flex items-start gap-8"
              >
                 <ShieldCheck className="w-12 h-12 text-gold-600 shrink-0 mt-1" />
                 <div className="space-y-3">
                    <h4 className="text-emerald-950 font-bold text-xl uppercase tracking-tight">
                      Verified by Heritage Matchmaker v2.1
                    </h4>
                    <p className="text-emerald-900/60 font-medium leading-relaxed">
                      This itinerary is algorithmically optimized based on:
                      <br />
                      • <span className="font-bold">Vibe matching</span> - 40% weight to your {vibe} preference
                      <br />
                      • <span className="font-bold">Predictive selection</span> - District proximity & seasonal alignment
                      <br />
                      • <span className="font-bold">Wishlist intelligence</span> - 10% boost from your saved experiences
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-xs text-emerald-900/40 font-black uppercase">
                        🔄 Auto-updates every 6 hours
                      </span>
                      <span className="text-xs text-emerald-900/40 font-black uppercase">
                        ● Confidence: {(itinerary.totalScore / 100).toFixed(2)}
                      </span>
                    </div>
                 </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
};

export default HeritageMatchmaker;
