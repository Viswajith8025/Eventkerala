import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2, CalendarX, Sparkles, Map as MapIcon, Grid } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FDFDFF]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-purple-50 rounded-full blur-[100px] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-10">
            <Sparkles className="w-4 h-4" />
            <span>Discover the magic of kerala</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-[1.05] mb-8 font-display">
            Stories <span className="text-indigo-600 italic">Happen</span> <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Everywhere.</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Find the perfect events, festivals, and gatherings tailored for you in the heart of God's Own Country.
          </p>
        </div>
      </section>

      {/* Filter Component */}
      <section className="px-4 -mt-20">
        <EventFilter onFilterChange={handleFilterChange} />
      </section>

      {/* Events View Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 font-display">
              {filters.district || filters.date ? 'Filtered Highlights' : 'Curated for You'}
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-gray-500 font-medium">Found {events.length} upcoming events</p>
            </div>
          </div>
          
          {/* View Toggler */}
          <div className="flex p-1 bg-gray-100 rounded-2xl w-fit self-start md:self-auto border border-gray-200 shadow-sm">
             <button 
               onClick={() => setViewMode('grid')}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${
                 viewMode === 'grid' 
                   ? 'bg-white text-indigo-600 shadow-lg shadow-gray-200' 
                   : 'text-gray-500 hover:text-gray-900'
               }`}
             >
               <Grid className="w-4 h-4" />
               Grid View
             </button>
             <button 
               onClick={() => setViewMode('map')}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${
                 viewMode === 'map' 
                   ? 'bg-white text-indigo-600 shadow-lg shadow-gray-200' 
                   : 'text-gray-500 hover:text-gray-900'
               }`}
             >
               <MapIcon className="w-4 h-4" />
               Map View
             </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 p-8 rounded-[2.5rem] text-center max-w-xl mx-auto">
            <h4 className="font-bold text-lg mb-2">Oops! Something went wrong</h4>
            <p className="opacity-80">{error}</p>
          </div>
        ) : events.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-500">
               <EventMap events={events} />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-gray-200">
             <div className="bg-gray-50 p-8 rounded-full">
               <CalendarX className="w-16 h-16 text-gray-300" />
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-black text-gray-900 font-display">No events found</h3>
               <p className="text-gray-500 max-w-sm mx-auto">
                 We couldn't find anything matching your exact search. Try expanding your filters.
               </p>
             </div>
             <button 
               onClick={() => handleFilterChange({ district: '', date: '', search: '' })}
               className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
             >
               Explore All Events
             </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
