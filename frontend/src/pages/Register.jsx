import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-20">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Join EventKerala</h1>
            <p className="text-gray-500 mt-2">Discover and manage events across Kerala</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl py-3.5 pl-12 pr-4 transition-all text-gray-700"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl py-3.5 pl-12 pr-4 transition-all text-gray-700"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                <input
                  type="password"
                  required
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl py-3.5 pl-12 pr-4 transition-all text-gray-700"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Account Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`flex-1 py-3 rounded-2xl border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
                    formData.role === 'user' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" /> User
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`flex-1 py-3 rounded-2xl border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
                    formData.role === 'admin' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" /> Admin
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2 px-4">
                * Note: In production, Admin registration would be restricted.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
