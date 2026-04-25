/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

export const EventCardSkeleton = ({ index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Layered Decorative Border */}
      <div className="absolute inset-0 bg-gold-500/5 rounded-[3rem] -rotate-2 animate-pulse"></div>

      <div className="relative bg-white border border-emerald-900/5 rounded-[2.5rem] p-5 shadow-xl shadow-emerald-900/5 overflow-hidden">
        {/* Image Skeleton with subtle gradient */}
        <div className="aspect-[4/5] rounded-[2rem] mb-8 relative overflow-hidden">
          <motion.div
            animate={{
              background: ['rgba(6, 78, 59, 0.03)', 'rgba(6, 78, 59, 0.07)', 'rgba(6, 78, 59, 0.03)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-full h-full"
          />
          {/* Editorial Badge Skeleton */}
          <div className="absolute top-5 left-5 h-6 w-20 bg-emerald-900/5 rounded-full"></div>
          {/* Date Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-emerald-900/5 to-transparent">
             <div className="h-6 w-24 bg-emerald-900/5 rounded"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 px-2">
          {/* Category Badge */}
          <div className="h-5 bg-gold-500/10 rounded-full w-1/3 mx-auto"></div>

          {/* Title Lines */}
          <div className="space-y-3">
            <div className="h-10 bg-emerald-900/5 rounded-xl w-4/5 mx-auto"></div>
            <div className="h-8 bg-emerald-900/5 rounded-xl w-2/3 mx-auto"></div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 justify-center">
            <div className="w-4 h-4 bg-gold-500/10 rounded-full"></div>
            <div className="h-4 bg-emerald-900/5 rounded w-1/2"></div>
          </div>

          {/* Button Skeleton */}
          <div className="h-14 bg-emerald-900/5 rounded-2xl mt-6"></div>
        </div>
      </div>
    </motion.div>
  );
};

export const PlaceCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="relative bg-white border border-emerald-900/5 rounded-[3.5rem] p-4 shadow-xl shadow-emerald-900/5 overflow-hidden">
        <div className="aspect-[4/5] rounded-[2.5rem] mb-8 relative overflow-hidden">
          <motion.div
            animate={{
              background: ['rgba(212, 175, 55, 0.05)', 'rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.05)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-full h-full"
          />
        </div>
        <div className="p-8 pt-10 space-y-6">
          <div className="h-4 bg-gold-500/10 rounded-full w-1/3 mx-auto"></div>
          <div className="h-12 bg-emerald-900/5 rounded-xl w-3/4 mx-auto"></div>
          <div className="h-4 bg-emerald-900/5 rounded-lg w-full"></div>
          <div className="h-4 bg-emerald-900/5 rounded-lg w-2/3 mx-auto"></div>
          <div className="h-0.5 w-12 bg-emerald-900/10 mx-auto"></div>
          <div className="h-6 bg-emerald-900/5 rounded-lg w-1/2 mx-auto mt-4"></div>
        </div>
      </div>
    </motion.div>
  );
};
