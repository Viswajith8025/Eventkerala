import React, { useEffect, useState } from 'react';
import { MapPin, Loader2, Compass, Sparkles } from 'lucide-react';
import api from '../services/api';
import { PlaceCardSkeleton } from '../components/Skeleton';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await api.get('/places');
        setPlaces(response.data.data);
      } catch (err) {
        setError('Could not load places. Please try again later.');
      } finally {
        // Mock delay for skeleton showcase
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Decorative elements */}
        <div className="absolute top-40 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-0 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-30"></div>

        <div className="text-center mb-24 space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50/80 backdrop-blur-md border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
            <Compass className="w-4 h-4" />
            <span>Curated Destinations</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight font-display leading-tight">
            God's Own <span className="text-indigo-600 italic">Country</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Explore the soul of Kerala through its most iconic landmarks, hidden trails, and serene getaways.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 p-10 rounded-[2.5rem] text-center max-w-lg mx-auto">
            <h4 className="font-bold text-lg mb-2">Something went wrong</h4>
            <p className="opacity-80">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
            {places.map((place) => (
              <div key={place._id} className="group bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(79,70,229,0.12)] transition-all duration-700 hover:-translate-y-3">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 right-6 bg-white/40 backdrop-blur-xl border border-white/30 px-4 py-2 rounded-2xl text-[10px] font-bold text-gray-900 uppercase tracking-widest shadow-sm">
                    {place.category || 'Spotlight'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-10">
                  <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{place.district}</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-6 font-display group-hover:text-indigo-600 transition-colors tracking-tight">
                    {place.name}
                  </h3>
                  <p className="text-gray-500 leading-relaxed line-clamp-3 font-medium text-base mb-10 opacity-80 group-hover:opacity-100 transition-opacity">
                    {place.description}
                  </p>
                  <button className="w-full py-5 bg-gray-900 text-white font-bold rounded-2xl group-hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-gray-100 uppercase tracking-tighter active:scale-95 flex items-center justify-center gap-2">
                    Explore Haven
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && places.length === 0 && (
          <div className="text-center py-40 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-gray-200">
            <Compass className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-bold font-display">No destinations discovered yet.</p>
            <p className="text-gray-400 mt-2">Check back soon for curated travel guides.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Places;
