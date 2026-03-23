import React from 'react';
import { Search, MapPin, Calendar, X, SlidersHorizontal } from 'lucide-react';
import { KERALA_DISTRICTS } from '../utils/constants';

const EventFilter = ({ onFilterChange }) => {
  const [district, setDistrict] = React.useState('');
  const [date, setDate] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleFilter = () => {
    onFilterChange({ district, date, search: searchTerm });
  };

  const clearFilters = () => {
    setDistrict('');
    setDate('');
    setSearchTerm('');
    onFilterChange({ district: '', date: '', search: '' });
  };

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/40 p-3 md:p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          
          {/* Search Input Group */}
          <div className="flex items-center flex-1 px-6 py-4 gap-4 w-full bg-gray-50/50 rounded-3xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100/50 transition-all duration-300">
            <Search className="text-indigo-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search experiences..." 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-medium placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="hidden lg:block h-10 w-px bg-gray-100"></div>

          {/* District Selector Group */}
          <div className="flex items-center px-6 py-4 gap-4 w-full lg:w-72 bg-gray-50/50 rounded-3xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all duration-300">
            <MapPin className="text-indigo-400 w-5 h-5" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 ml-1">Location</p>
              <select 
                className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-bold py-0 h-auto appearance-none cursor-pointer"
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
          <div className="flex items-center px-6 py-4 gap-4 w-full lg:w-60 bg-gray-50/50 rounded-3xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all duration-300">
            <Calendar className="text-indigo-400 w-5 h-5" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 ml-1">When</p>
              <input 
                type="date" 
                className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-bold py-0 h-auto cursor-pointer"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full lg:w-auto p-1 lg:p-0">
            <button 
              onClick={handleFilter}
              className="flex-1 lg:flex-none bg-indigo-600 text-white px-10 py-5 rounded-[1.8rem] hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
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
