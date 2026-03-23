import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Heart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Calendar className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                EventKerala
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Events</Link>
              <Link to="/places" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Places</Link>
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-bold flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-indigo-600 group-hover:text-white" />
                  </div>
                  <span>Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> 
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-bold px-4">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold">
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="space-y-4">
            <Link 
              to="/" 
              className="block px-4 py-3 text-gray-600 hover:text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-all" 
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/places" 
              className="block px-4 py-3 text-gray-600 hover:text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-all" 
              onClick={() => setIsOpen(false)}
            >
              Places
            </Link>
          </div>
          
          <div className="pt-6 border-t border-gray-50 space-y-4">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/admin" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-all" 
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-4 py-3 text-gray-600 hover:text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-all" 
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center bg-indigo-600 text-white px-5 py-4 rounded-xl font-bold shadow-lg shadow-indigo-100" 
                  onClick={() => setIsOpen(false)}
                >
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
