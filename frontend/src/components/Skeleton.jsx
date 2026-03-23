import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`}></div>
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-4">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="space-y-3 px-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
};

export const PlaceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-8 space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full mt-4" />
      </div>
    </div>
  );
};

export default Skeleton;
