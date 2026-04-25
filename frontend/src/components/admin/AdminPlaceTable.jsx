import React from 'react';
import { Trash2 } from 'lucide-react';

const AdminPlaceTable = ({ places, searchTerm, onDelete }) => {
  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-50/50 border-b border-gray-100">
          <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Heritage Place</th>
          <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">District</th>
          <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Category</th>
          <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {filteredPlaces.map((place) => (
          <tr key={place._id} className="hover:bg-emerald-50/30 transition-all group">
            <td className="px-10 py-8">
              <div className="flex items-center gap-6">
                <img src={place.image} alt="" className="w-16 h-16 rounded-[1.2rem] object-cover shadow-lg" loading="lazy" />
                <div>
                  <p className="font-black text-gray-900 text-lg font-display tracking-tight">{place.name}</p>
                  <p className="text-xs text-gray-400 font-medium line-clamp-1 max-w-sm italic mt-1">{place.description}</p>
                </div>
              </div>
            </td>
            <td className="px-10 py-8">
              <span className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-black uppercase tracking-widest font-bold">
                {place.district}
              </span>
            </td>
            <td className="px-10 py-8 text-center">
              <span className="inline-flex items-center px-4 py-1.5 bg-gold-50 text-gold-600 rounded-full text-xs font-black uppercase tracking-widest font-bold">
                {place.category}
              </span>
            </td>
            <td className="px-10 py-8 text-right">
              <button 
                onClick={() => onDelete(place._id)}
                className="p-3 bg-red-50 text-red-600 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                title="Delete Heritage Place"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminPlaceTable;
