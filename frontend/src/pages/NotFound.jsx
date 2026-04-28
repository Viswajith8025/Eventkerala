import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative inline-block"
        >
          <div className="w-48 h-48 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center justify-center mx-auto mb-12 shadow-3xl">
            <Compass className="w-20 h-20 text-gold-500 animate-spin-slow" />
          </div>
          <span className="absolute -top-4 -right-4 bg-gold-500 text-emerald-950 font-black px-6 py-2 rounded-2xl text-lg shadow-2xl rotate-12">
            404
          </span>
        </motion.div>

        <div className="space-y-6">
          <h1 className="text-7xl md:text-8xl font-display font-medium text-white leading-none tracking-tighter">
            Path <span className="text-gold-500 italic">Lost.</span>
          </h1>
          <p className="text-white/40 text-xl md:text-2xl font-light italic leading-relaxed max-w-lg mx-auto">
            The heritage trail you seek has vanished into the mist. Perhaps the spirits have relocated this legend.
          </p>
        </div>

        <div className="pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-4 bg-gold-500 text-emerald-950 px-12 py-6 rounded-[2rem] font-black text-xs tracking-[0.4em] uppercase hover:bg-white hover:scale-105 transition-all shadow-3xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sanctuary
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
