import React from 'react';
import { X } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { KERALA_DISTRICTS } from '../../utils/constants';

const PlaceFormModal = ({ show, onClose, formData, setFormData, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl">
         <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-10 py-8 border-b border-gray-100 flex items-center justify-between">
           <h2 className="text-3xl font-black font-display text-gray-900">Add Heritage Place</h2>
           <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
             <X className="w-6 h-6 text-gray-400" />
           </button>
         </div>
         
         <form onSubmit={onSubmit} className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                 <ImageUpload onUploadSuccess={(url) => setFormData({...formData, image: url})} />
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {['Beach', 'Hill Station', 'Backwater', 'Waterfall', 'Heritage', 'Temple', 'Spiritual', 'Nature', 'other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Place Name</label>
                  <input 
                    type="text" required placeholder="Ex: Mattancherry Palace"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-black text-gray-900 focus:ring-2 focus:ring-emerald-100"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                  <select 
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100 transition-all"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                  >
                    <option value="">Select District</option>
                    {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required rows="6" placeholder="Describe the heritage and significance..."
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-100"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="pt-10 border-t border-gray-100 flex justify-end gap-6">
              <button type="button" onClick={onClose} className="px-8 py-4 font-bold text-gray-400 hover:text-gray-900 transition-all">Cancel</button>
              <button type="submit" className="px-14 py-4 bg-emerald-900 text-white rounded-[1.5rem] font-black hover:bg-emerald-800 transition-all shadow-2xl shadow-emerald-900/10">Save Heritage Place</button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default PlaceFormModal;
