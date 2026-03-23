import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2, CalendarX, Sparkles, Map as MapIcon, Grid, ScrollText } from 'lucide-react';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import EventMap from '../components/EventMap';
import { EventCardSkeleton } from '../components/Skeleton';
import api from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ district: '', date: '', search: '' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  const fetchEvents = async (queryFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (queryFilters.district) params.append('district', queryFilters.district);
      if (queryFilters.date) params.append('date', queryFilters.date);
      if (queryFilters.search) params.append('search', queryFilters.search);
      
      const endpoint = (queryFilters.district || queryFilters.date || queryFilters.search) 
        ? `/events/filter?${params.toString()}` 
        : '/events';

      const response = await api.get(endpoint);
      setEvents(response.data.data);
    } catch (err) {
      setError('Could not load events. Please try again later.');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchEvents(newFilters);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Editorial Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover"
             alt="Kerala Backwaters"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-3xl space-y-10">
            <div className="flex items-center gap-4 text-gold-500 animate-in fade-in slide-in-from-left duration-1000">
               <div className="h-px w-12 bg-gold-500"></div>
               <span className="text-xs font-black uppercase tracking-[0.4em]">The Grand Experience</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-display font-medium text-white leading-[0.9] animate-in fade-in slide-in-from-left duration-1000 delay-200">
              Where <br />
              <span className="italic text-gold-500">Culture</span> <br />
              Meets Life.
            </h1>
            
            <p className="text-xl text-gray-300 max-w-xl leading-relaxed italic font-light animate-in fade-in slide-in-from-left duration-1000 delay-500">
              Curated celebrations, legendary performances, and the untold stories of God's Own Country.
            </p>

            <div className="flex items-center gap-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
               <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} className="px-10 py-5 bg-gold-500 text-emerald-950 rounded-2xl font-black text-xs tracking-widest hover:scale-105 transition-all shadow-2xl shadow-gold-500/20">
                 EXPLORE EVENTS
               </button>
               <div className="flex items-center gap-3 text-gold-500/60 cursor-pointer hover:text-gold-500 transition-colors">
                  <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center">
                    <ScrollText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase">Scroll Stories</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Filter Integration */}
      <section className="max-w-5xl mx-auto px-4 -mt-16 relative z-30">
        <EventFilter onFilterChange={handleFilterChange} />
      </section>

      {/* Event Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 border-b border-emerald-900/10 pb-12">
          <div className="space-y-4">
            <h2 className="text-6xl font-display font-medium text-emerald-950">
              Upcoming <br /> <span className="text-gold-600 italic">Traditions.</span>
            </h2>
            <p className="text-emerald-900/60 font-medium">Verified by our heritage experts in {new Date().getFullYear()}</p>
          </div>
          
          {/* View Toggler */}
          <div className="flex p-2 bg-emerald-900/5 rounded-2xl w-fit self-start md:self-auto ring-1 ring-emerald-900/10">
             <button 
               onClick={() => setViewMode('grid')}
               className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all font-black text-[10px] tracking-widest uppercase ${
                 viewMode === 'grid' 
                   ? 'bg-emerald-900 text-gold-500 shadow-xl' 
                   : 'text-emerald-950/60 hover:text-emerald-950'
               }`}
             >
               <Grid className="w-4 h-4" /> Gridview
             </button>
             <button 
               onClick={() => setViewMode('map')}
               className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all font-black text-[10px] tracking-widest uppercase ${
                 viewMode === 'map' 
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
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
    </div>
  );
};

export default Home;
