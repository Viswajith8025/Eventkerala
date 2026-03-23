import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gold-500/5 rounded-[3rem] -rotate-2"></div>
      <div className="relative bg-white border border-emerald-900/5 rounded-[2.5rem] p-5 shadow-xl shadow-emerald-900/5 animate-pulse">
        <div className="aspect-[4/5] bg-emerald-900/5 rounded-[2rem] mb-8"></div>
        <div className="space-y-6 px-2">
          <div className="h-0.5 w-1/2 bg-gold-500/20 mx-auto"></div>
          <div className="h-10 bg-emerald-900/5 rounded-xl w-3/4"></div>
          <div className="h-4 bg-emerald-900/5 rounded-lg w-1/2"></div>
          <div className="h-16 bg-emerald-900/5 rounded-2xl w-full mt-6"></div>
        </div>
      </div>
    </div>
  );
};

export const PlaceCardSkeleton = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-emerald-900/5 rounded-[4rem]"></div>
      <div className="relative bg-white border border-emerald-900/5 rounded-[3.5rem] p-4 shadow-xl shadow-emerald-900/5 animate-pulse">
        <div className="aspect-[4/5] bg-emerald-900/5 rounded-[2.5rem]"></div>
        <div className="p-8 pt-10 space-y-6">
          <div className="h-4 bg-gold-500/10 rounded-full w-1/3 mx-auto"></div>
          <div className="h-12 bg-emerald-900/5 rounded-xl w-3/4 mx-auto"></div>
          <div className="h-4 bg-emerald-900/5 rounded-lg w-full"></div>
          <div className="h-4 bg-emerald-900/5 rounded-lg w-2/3 mx-auto"></div>
          <div className="h-0.5 w-12 bg-emerald-900/10 mx-auto"></div>
          <div className="h-6 bg-emerald-900/5 rounded-lg w-1/2 mx-auto mt-4"></div>
        </div>
      </div>
    </div>
  );
};
