import React from 'react';
import { X } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { KERALA_DISTRICTS } from '../../utils/constants';

const EventFormModal = ({ show, onClose, formData, setFormData, onSubmit, isEdit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl">
         <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-10 py-8 border-b border-gray-100 flex items-center justify-between">
           <h2 className="text-3xl font-black font-display text-gray-900">{isEdit ? 'Refine Chronicle' : 'Create New Event'}</h2>
           <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
             <X className="w-6 h-6 text-gray-400" />
           </button>
         </div>
         
         <form onSubmit={onSubmit} className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                 <ImageUpload onUploadSuccess={(url) => setFormData({...formData, image: url})} />
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Latitude</label>
                     <input 
                       type="number" step="any" placeholder="9.9312"
                       className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                       value={formData.latitude || ''}
                       onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Longitude</label>
                     <input 
                       type="number" step="any" placeholder="76.2673"
                       className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                       value={formData.longitude || ''}
                       onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                     />
                   </div>
                 </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                  <input 
                    type="text" required placeholder="Ex: Kochi Music Festival"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-black text-gray-900 focus:ring-2 focus:ring-emerald-100"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                    <select 
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                    >
                      <option value="">Select District</option>
                      {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                    <input 
                      type="date" required
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Specific Location</label>
                  <input 
                    type="text" required placeholder="Ex: Marine Drive, Kochi"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Booking Portal URL (Optional)</label>
                  <input 
                    type="url" placeholder="https://booking-partner.com/event-id"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                    value={formData.bookingLink || ''}
                    onChange={(e) => setFormData({...formData, bookingLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required rows="5" placeholder="Tell us about the event..."
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-100 transition-all"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex items-center justify-between bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-emerald-950 uppercase tracking-widest">Enable Community Chat</p>
                    <p className="text-[10px] text-emerald-800/60 font-medium italic">Allow explorers to discuss this event in real-time</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, chatEnabled: !formData.chatEnabled})}
                    className={`w-14 h-8 rounded-full relative transition-all duration-300 ${formData.chatEnabled ? 'bg-emerald-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${formData.chatEnabled ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-10 border-t border-gray-100 flex justify-end gap-6">
              <button type="button" onClick={onClose} className="px-8 py-4 font-bold text-gray-400 hover:text-gray-900 transition-all">Cancel</button>
              <button type="submit" className="px-14 py-4 bg-emerald-900 text-white rounded-[1.5rem] font-black hover:bg-emerald-800 transition-all shadow-2xl shadow-emerald-900/10 active:scale-95">
                {isEdit ? 'Update Chronicle' : 'Publish Event'}
              </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default EventFormModal;
