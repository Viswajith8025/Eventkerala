/* eslint-disable no-unused-vars */
import React, { useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles, CheckCircle, ScrollText, Calendar } from 'lucide-react';
import HeartButton from './HeartButton';
import { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventCard = memo(({ event, index = 0 }) => {
  const { isLoggedIn } = useAuth();
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Subtle tilt effect (max rotation 3deg)
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  // Smooth out the spring
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative perspective-1000"
    >
      {/* Layered Decorative Border */}
      <div className="absolute inset-0 bg-gold-500/10 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>

      <motion.div
        ref={cardRef}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-white border border-emerald-900/5 rounded-[2.5rem] p-5 shadow-xl shadow-emerald-900/5 hover:shadow-gold-500/10 transition-all duration-500"
      >
        {/* Image Container with Gold Accent */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] mb-6 ring-1 ring-emerald-900/10">
          <motion.img
            layoutId={`event-image-${event._id}`}
            src={getImageUrl(event.image)}
            alt={event.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            loading="lazy"
          />

          {/* Dynamic Trust Badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            {event.isSponsored && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gold-500 text-emerald-950 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg shadow-gold-500/20 flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3" /> Sponsored
              </motion.div>
            )}
            <div className="bg-white/90 backdrop-blur-md text-emerald-950 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-2 shadow-xl">
              {event.organizer?.isVerified ? (
                <>
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Legend
                </>
              ) : (
                <>
                  <ScrollText className="w-3 h-3 text-gold-600" /> {event.category}
                </>
              )}
            </div>
          </div>

          {isLoggedIn && (
            <div className="absolute top-5 right-5 z-50">
              <HeartButton item={event} type="event" aria-label={`Add ${event.title} to wishlist`} />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent">
            <div className="flex items-center gap-2 text-gold-500/80 text-xs font-black uppercase tracking-[0.2em] mb-2">
              <Calendar className="w-3 h-3" />
              {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <h3 className="text-2xl md:text-3xl font-display text-white leading-tight group-hover:text-gold-500 transition-colors">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-950/5 flex items-center justify-center border border-emerald-950/10">
                  <MapPin className="w-4 h-4 text-emerald-950" />
               </div>
               <span className="text-xs font-black text-emerald-950 uppercase tracking-widest">{event.district}</span>
            </div>
            <span className="text-xs font-black bg-emerald-950/5 text-emerald-950/40 px-3 py-1 rounded-full uppercase">
              {event.price === 0 ? 'Free Entry' : `₹${event.price}`}
            </span>
          </div>

          <p className="text-emerald-900/50 text-sm font-medium line-clamp-2 italic leading-relaxed">
            {event.description}
          </p>

          <Link 
            to={`/events/${event._id}`} 
            className="flex items-center justify-center w-full py-5 bg-emerald-950 text-gold-500 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-950/5 group/btn overflow-hidden relative"
          >
             <span className="font-black text-xs tracking-[0.3em] uppercase">View Event Details</span>
             <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" />
           </Link>
         </div>

       </motion.div>
     </motion.div>
   );
});

export default EventCard;
