import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, LayoutDashboard, Settings, 
  Users, Calendar, Plus, X, Search, Filter, Trash2, AlertCircle 
} from 'lucide-react';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';
import { KERALA_DISTRICTS } from '../utils/constants';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', district: '', date: '', 
    location: '', image: '', latitude: '', longitude: ''
  });

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events'); 
      // Note: In a real app, use an admin-only route that returns ALL statuses
      setEvents(response.data.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/events/${id}`, { status });
      setEvents(events.map(ev => ev._id === id ? { ...ev, status } : ev));
    } catch (err) {
      alert('Failed to update status. Admin permission required.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(ev => ev._id !== id));
      alert('Event deleted successfully');
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert('Please upload an image first');
    
    try {
      const response = await api.post('/events', {
        ...formData,
        latitude: parseFloat(formData.latitude) || undefined,
        longitude: parseFloat(formData.longitude) || undefined,
        status: 'approved' 
      });
      
      setEvents([response.data.data, ...events]);
      setShowAddModal(false);
      setFormData({ title: '', description: '', district: '', date: '', location: '', image: '', latitude: '', longitude: '' });
    } catch (err) {
      alert('Failed to create event.');
    }
  };

  // Filter & Search Logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 font-display flex items-center gap-3">
              <LayoutDashboard className="text-indigo-600 w-10 h-10" />
              Command Center
            </h1>
            <p className="text-gray-500 font-medium">Moderating God's Own Country, one event at a time.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by title or district..."
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
               {['all', 'pending', 'approved', 'rejected'].map((status) => (
                 <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    statusFilter === status 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                 >
                   {status}
                 </button>
               ))}
            </div>

            <button 
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-5 h-5" /> Add Event
            </button>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl">
               <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                 <h2 className="text-3xl font-black font-display text-gray-900">Create New Event</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                   <X className="w-6 h-6 text-gray-400" />
                 </button>
               </div>
               
               <form onSubmit={handleCreateEvent} className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <ImageUpload onUploadSuccess={(url) => setFormData({...formData, image: url})} />
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Latitude</label>
                           <input 
                             type="number" step="any" placeholder="9.9312"
                             className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                             value={formData.latitude}
                             onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Longitude</label>
                           <input 
                             type="number" step="any" placeholder="76.2673"
                             className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                             value={formData.longitude}
                             onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                           />
                         </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                        <input 
                          type="text" required placeholder="Ex: Kochi Music Festival"
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-black text-gray-900 focus:ring-2 focus:ring-indigo-100"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                          <select 
                            required
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                            value={formData.district}
                            onChange={(e) => setFormData({...formData, district: e.target.value})}
                          >
                            <option value="">Select District</option>
                            {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                          <input 
                            type="date" required
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specific Location</label>
                        <input 
                          type="text" required placeholder="Ex: Marine Drive, Kochi"
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                          required rows="5" placeholder="Tell us about the event..."
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="pt-10 border-t border-gray-100 flex justify-end gap-6">
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-8 py-4 font-bold text-gray-400 hover:text-gray-900 transition-all">Cancel</button>
                    <button type="submit" className="px-14 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95">Publish Event</button>
                  </div>
               </form>
            </div>
          </div>
        )}

        {/* Events Table Container */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Identification</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Region</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Current Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <img src={event.image} alt="" className="w-16 h-16 rounded-[1.2rem] object-cover shadow-lg" />
                          <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${
                            event.status === 'approved' ? 'bg-green-500' : 
                            event.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-lg font-display tracking-tight">{event.title}</p>
                          <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.date).toDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center md:text-left">
                      <span className="inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {event.district}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        event.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        event.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {event.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(event._id, 'approved')}
                              className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(event._id, 'rejected')}
                              className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleStatusUpdate(event._id, 'pending')}
                            className="px-4 py-2 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Reset
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteEvent(event._id)}
                          className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Permanently Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEvents.length === 0 && !loading && (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-gray-200" />
                <p className="text-gray-400 font-bold font-display text-xl">No matching events discovered.</p>
                <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="text-indigo-600 font-black text-xs uppercase tracking-widest border-b-2 border-indigo-100">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
