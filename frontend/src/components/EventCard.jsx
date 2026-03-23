import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="group relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] mb-6">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* Glass Badge - District */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-4 py-2 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl text-[11px] font-bold text-white uppercase tracking-wider shadow-lg">
          <MapPin className="w-3 h-3" />
          {event.district}
        </div>

        {/* Floating Date Badge */}
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold shadow-xl shadow-indigo-600/20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          {formattedDate}
        </div>
      </div>

      {/* Content */}
      <div className="px-2 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {event.status === 'approved' ? 'Active Event' : 'Featured'}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold font-display text-gray-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-4 text-gray-500 text-sm font-medium mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            {formattedDate}
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1.5 overflow-hidden">
             <MapPin className="w-4 h-4 text-gray-400" />
             <span className="truncate">{event.location}</span>
          </div>
        </div>

        <Link to={`/events/${event._id}`} className="w-full py-4 bg-gray-900 text-white text-sm font-bold rounded-[1.5rem] flex items-center justify-center gap-2 group/btn relative overflow-hidden transition-all duration-300 active:scale-95 hover:bg-indigo-600 shadow-xl shadow-indigo-100">
           <span className="relative z-10 font-bold">Details</span>
           <ArrowRight className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
