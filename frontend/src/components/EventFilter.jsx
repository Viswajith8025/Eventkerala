import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { KERALA_DISTRICTS } from '../utils/constants';
import useFuzzySearch from '../hooks/useFuzzySearch';

const EventFilter = ({ onFilterChange, allEvents = [] }) => {
  const [district, setDistrict] = React.useState('');
  const [date, setDate] = React.useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Fuzzy search integration with ethnic spelling tolerance
  const { query, setQuery, results } = useFuzzySearch(allEvents, {
    threshold: 0.4,
    includeMatches: true
  });

  // Get smart suggestions based on current search
  const suggestions = results.slice(0, 5).map(r => r.title);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilter = (overrideFilters = {}) => {
    const filters = {
      district: overrideFilters.district ?? district,
      date: overrideFilters.date ?? date,
      search: overrideFilters.search ?? searchTerm
    };
    onFilterChange(filters);
    setShowSuggestions(false);
  };

  const handleSearchChange = (value) => {
    setQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const clearFilters = () => {
    setDistrict('');
    setDate('');
    setQuery('');
    setShowSuggestions(false);
    onFilterChange({ district: '', date: '', search: '' });
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleFilter({ search: suggestion });
  };

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/40 p-3 md:p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col lg:flex-row items-center gap-3">

          {/* Search Input Group with Fuzzy Suggestions */}
          <div className="flex items-center flex-1 px-6 py-4 gap-4 w-full bg-emerald-900/5 rounded-3xl border border-transparent focus-within:border-emerald-900/10 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-900/5 transition-all duration-300 relative" ref={searchRef}>
            <Search className="text-emerald-900/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search traditions, festivals, places..."
              className="w-full bg-transparent border-none focus:ring-0 text-emerald-950 font-medium placeholder:text-emerald-900/40"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
            />
            {searchTerm && (
              <button onClick={() => handleSearchChange('')} className="text-emerald-900/40 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Smart Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-emerald-900/10 overflow-hidden z-50">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-6 py-3 text-left text-sm font-medium text-emerald-950 hover:bg-emerald-900/5 flex items-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {suggestion}
                  </button>
                ))}
                <div className="px-6 py-2 bg-emerald-900/5 text-xs text-emerald-900/40 font-black uppercase tracking-wider">
                  ✨ Smart suggestions powered by fuzzy matching
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block h-10 w-px bg-gray-100"></div>

          {/* District Selector Group */}
          <div className="flex items-center px-6 py-4 gap-4 w-full lg:w-72 bg-emerald-900/5 rounded-3xl border border-transparent focus-within:border-emerald-900/10 focus-within:bg-white transition-all duration-300">
            <MapPin className="text-emerald-900/40 w-5 h-5" />
            <div className="flex-1">
              <p className="text-xs text-emerald-900/40 font-black uppercase tracking-widest mb-0.5 ml-1">Location</p>
              <select
                className="w-full bg-transparent border-none focus:ring-0 text-emerald-950 font-black py-0 h-auto appearance-none cursor-pointer text-xs"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">All Kerala</option>
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden lg:block h-10 w-px bg-gray-100"></div>

          {/* Date Picker Group */}
          <div className="flex items-center px-6 py-4 gap-4 w-full lg:w-64 bg-emerald-900/5 rounded-3xl border border-transparent focus-within:border-emerald-900/10 focus-within:bg-white transition-all duration-300">
            <Calendar className="text-emerald-900/40 w-5 h-5" />
            <div className="flex-1">
              <p className="text-xs text-emerald-900/40 font-black uppercase tracking-widest mb-0.5 ml-1">When</p>
              <input
                type="date"
                className="w-full bg-transparent border-none focus:ring-0 text-emerald-950 font-black py-0 h-auto cursor-pointer text-xs"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full lg:w-auto p-1 lg:p-0">
            <button
              onClick={() => handleFilter()}
              className="flex-1 lg:flex-none bg-heritage-gradient text-gold-500 px-10 py-5 rounded-[1.8rem] transition-all font-black text-xs tracking-widest shadow-xl shadow-emerald-950/10 active:scale-95 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH</span>
            </button>

            {(district || date || searchTerm) && (
              <button
                onClick={clearFilters}
                className="p-5 rounded-[1.8rem] bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                title="Reset Filters"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFilter;
