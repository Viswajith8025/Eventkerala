import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Camera, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeartButton from './HeartButton';
import { useAuth } from '../context/AuthContext';

const PlaceCard = ({ place, index = 0 }) => {
  const { isLoggedIn } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-emerald-900/5 transition-all duration-700 group-hover:ring-gold-500/30">
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
        
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
          <div className="flex items-center gap-2 text-gold-500/80 text-[10px] font-black uppercase tracking-[0.3em]">
            <Camera className="w-3 h-3" />
            {place.category}
          </div>
          
          <h3 className="text-3xl font-display text-white group-hover:text-gold-500 transition-colors">
            {place.name}
          </h3>
          
          <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
            <MapPin className="w-3 h-3 text-gold-500" />
            {place.district}
          </div>

          <div className="pt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
             <Link 
                to={`/places/${place._id}`}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 hover:text-emerald-950 hover:border-gold-500 transition-all"
             >
               Visit Landmark <Sparkles className="w-3 h-3" />
             </Link>
          </div>
        </div>

        {/* Wishlist Button */}
        {isLoggedIn && (
          <div className="absolute top-6 right-6 z-50">
            <HeartButton item={place} type="place" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlaceCard;
