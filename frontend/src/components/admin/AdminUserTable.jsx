import React from 'react';
import { User, Mail, Phone, Calendar, Shield, MapPin } from 'lucide-react';
import { getImageUrl } from '../../services/api';

const AdminUserTable = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">User Profile</th>
            <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Information</th>
            <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Interests</th>
            <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Joined Chronicles</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-emerald-50/30 transition-all group">
              <td className="px-10 py-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-emerald-900/5 flex items-center justify-center overflow-hidden border border-emerald-900/10 shadow-lg">
                      {user.profileImage ? (
                        <img src={getImageUrl(user.profileImage)} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-emerald-900/20 w-8 h-8" />
                      )}
                    </div>
                    {user.role === 'admin' && (
                      <div className="absolute -top-2 -right-2 bg-gold-500 text-emerald-950 p-1.5 rounded-lg shadow-xl border-2 border-white">
                        <Shield className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-lg font-display tracking-tight flex items-center gap-2">
                      {user.name}
                      {user.role === 'admin' && <span className="text-[9px] bg-gold-500/10 text-gold-700 px-2 py-0.5 rounded-full border border-gold-500/20">ROOT ADMIN</span>}
                    </p>
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5 mt-1">
                      <span className="uppercase tracking-widest text-[9px] bg-gray-100 px-2 py-0.5 rounded-md">ID: {user._id.slice(-6)}</span>
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-10 py-8">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" /> {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-[10px] font-black text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                      <Phone className="w-3.5 h-3.5" /> {user.phone}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-10 py-8">
                <div className="flex flex-wrap gap-2 max-w-xs">
                  {user.interests && user.interests.length > 0 ? (
                    user.interests.map((interest, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 bg-white border border-gray-100 text-emerald-900 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-300 font-bold italic">No interests set</span>
                  )}
                </div>
              </td>
              <td className="px-10 py-8 text-right">
                <p className="text-xs font-black text-gray-900 font-display">
                  {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center justify-end gap-1.5">
                  <Calendar className="w-3 h-3" /> Origin Point
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
