import React from 'react';
import { Calendar, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AdminEventTable = ({ events, onStatusUpdate, onDelete }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-50/50 border-b border-gray-100">
          <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Event Identification</th>
          <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Region</th>
          <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Current Status</th>
          <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Moderation Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {events.map((event) => (
          <tr key={event._id} className="hover:bg-emerald-50/30 transition-all group">
            <td className="px-10 py-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img src={event.image} alt="" className="w-16 h-16 rounded-[1.2rem] object-cover shadow-lg" loading="lazy" />
                  <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${
                    event.status === 'approved' ? 'bg-green-500' : 
                    event.status === 'pending' ? 'bg-amber-500' : 
                    event.status === 'finished' ? 'bg-slate-400' : 'bg-red-500'
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
            <td className="px-10 py-8">
              <span className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-black uppercase tracking-widest font-bold">
                {event.district}
              </span>
            </td>
            <td className="px-10 py-8 text-center">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                event.status === 'approved' ? 'bg-green-100 text-green-700' : 
                event.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                event.status === 'finished' ? 'bg-slate-100 text-slate-600' :
                'bg-red-100 text-red-700'
              }`}>
                {event.status}
              </span>
            </td>
            <td className="px-10 py-8 text-right">
              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {event.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onStatusUpdate(event._id, 'approved')}
                      className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onStatusUpdate(event._id, 'rejected')}
                      className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {event.status === 'approved' && (
                  <button 
                    onClick={() => onStatusUpdate(event._id, 'finished')}
                    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                    title="Mark as Finished"
                  >
                    Finish
                  </button>
                )}

                <button 
                  onClick={() => onStatusUpdate(event._id, 'pending')}
                  className="px-4 py-2 bg-gray-50 text-gray-400 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Reset
                </button>
                
                <button 
                  onClick={() => onDelete(event._id)}
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
  );
};

export default AdminEventTable;
