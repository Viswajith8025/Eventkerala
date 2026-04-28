import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Heart, Menu, X, LogOut, LayoutDashboard, Sparkles, User } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { wishlist } = useWishlist();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const clickTimerRef = React.useRef(null);

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      
      if (next === 5) {
        if (isAdmin) {
          navigate('/admin');
        } else {
          toast.error('Admin clearance required', {
             style: { borderRadius: '1rem', background: '#064e3b', color: '#fbbf24' }
          });
        }
        return 0;
      }

      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => setLogoClicks(0), 3000);
      
      return next;
    });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4 py-6 ${isScrolled ? 'pt-2' : 'pt-6'}`}>
      <div className={`w-full max-w-7xl transition-all duration-500 rounded-[2.5rem] border border-white/20 backdrop-blur-3xl shadow-2xl flex items-center justify-between px-10 py-5 ${isScrolled ? 'bg-emerald-950/90 py-3 shadow-emerald-900/20' : 'bg-white/10'
        }`}>
        {/* Logo with Secret Trigger */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 group cursor-pointer select-none"
        >
          <div className="bg-heritage-gradient p-1.5 rounded-2xl shadow-lg ring-1 ring-white/20 group-hover:scale-110 transition-transform overflow-hidden w-11 h-11 flex items-center justify-center">
            <img src="/logo.svg" alt="LiveKeralam Logo" className="w-full h-full object-contain" />
          </div>
          <span className={`text-2xl font-display font-black tracking-tight ${isScrolled ? 'text-white' : 'text-emerald-950'}`}>
            Live<span className="text-gold-500 italic">Keralam</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/#events" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-gray-300 hover:text-gold-500' : 'text-emerald-900 hover:text-emerald-700'}`}>Events</Link>
          <Link to="/places" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-gray-300 hover:text-gold-500' : 'text-emerald-900 hover:text-emerald-700'}`}>Places</Link>
          <Link to="/about" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-gray-300 hover:text-gold-500' : 'text-emerald-900 hover:text-emerald-700'}`}>About</Link>
          <Link to="/contact" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-gray-300 hover:text-gold-500' : 'text-emerald-900 hover:text-emerald-700'}`}>Contact</Link>

          <Link to="/soulsync" className="flex items-center gap-2 px-5 py-2.5 bg-gold-500/10 border border-gold-500/30 rounded-xl group hover:bg-gold-500/20 transition-all">
            <Sparkles className="w-4 h-4 text-gold-600 group-hover:scale-125 transition-transform" />
            <span className="text-xs font-black text-gold-600 uppercase tracking-widest">Heritage Matchmaker</span>
          </Link>

          {isLoggedIn && (
            <Link to="/wishlist" className="relative group p-2">
              <Heart className={`w-6 h-6 transition-all ${isScrolled ? 'text-white group-hover:text-gold-500' : 'text-emerald-950 group-hover:text-emerald-700'}`} />
              {(wishlist.events.length + wishlist.places.length) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-emerald-950 animate-bounce">
                  {wishlist.events.length + wishlist.places.length}
                </span>
              )}
            </Link>
          )}

          <div className="h-6 w-px bg-white/10 mx-4"></div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl group hover:bg-gold-500 transition-all">
                  <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center text-emerald-950 group-hover:bg-emerald-950 group-hover:text-gold-500 transition-all shadow-lg">
                     <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isScrolled ? 'text-white/40 group-hover:text-emerald-950' : 'text-emerald-900/40 group-hover:text-emerald-950'}`}>
                        {isAdmin ? 'Sovereign' : 'Guardian'}
                      </span>
                      <span className={`text-xs font-bold ${isScrolled ? 'text-white group-hover:text-emerald-950' : 'text-emerald-900 group-hover:text-emerald-950'}`}>Profile</span>
                  </div>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gold-500 text-emerald-950 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-white transition-all shadow-lg shadow-gold-500/10"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-white' : 'text-emerald-900'}`}>
                Login
              </Link>
              <Link to="/register" className="bg-heritage-gradient text-gold-500 border border-gold-500/30 px-7 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                JOIN US
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className={`md:hidden p-2 rounded-xl transition-colors ${isScrolled ? 'text-white bg-white/10' : 'text-emerald-900 bg-emerald-50'}`}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Drawer (simplified for now) */}
      {isOpen && (
        <div className="fixed inset-0 top-[100px] z-40 px-4 md:hidden">
          <div className="bg-emerald-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 shadow-2xl animate-in slide-in-from-top-4">
            <div className="space-y-6">
              <Link to="/#events" onClick={() => setIsOpen(false)} className="block text-3xl font-display font-bold text-white">Events</Link>
              <Link to="/places" onClick={() => setIsOpen(false)} className="block text-3xl font-display font-bold text-white">Places</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block text-3xl font-display font-bold text-white">Our Story</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-3xl font-display font-bold text-white">Contact</Link>
              <Link to="/soulsync" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-3xl font-display font-bold text-gold-500">
                <Sparkles className="w-8 h-8" />
                <span className="translate-y-1">Heritage Matchmaker</span>
              </Link>
              {isLoggedIn && (
                <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-3xl font-display font-bold text-white">
                  <Heart className="w-8 h-8" />
                  <span className="translate-y-1">Wishlist ({(wishlist.events?.length || 0) + (wishlist.places?.length || 0)})</span>
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-3xl font-display font-bold text-white">
                  <LayoutDashboard className="w-8 h-8" />
                  <span className="translate-y-1">Dashboard</span>
                </Link>
              )}
              <div className="h-px bg-white/10 my-8"></div>
              {isLoggedIn ? (
                <div className="space-y-4">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-gold-500 transition-all">
                      <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center text-emerald-950 group-hover:bg-emerald-950 group-hover:text-gold-500 transition-all shadow-lg">
                         <User className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-emerald-950">
                            {isAdmin ? 'Sovereign' : 'Guardian'}
                          </span>
                          <span className="text-lg font-display font-bold text-white group-hover:text-emerald-950">My Profile</span>
                      </div>
                  </Link>
                  <button onClick={handleLogout} className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">LOGOUT</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center border border-white/20 text-white py-5 rounded-2xl font-black uppercase tracking-widest">Login to Vault</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center bg-gold-500 text-emerald-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-gold-500/20">Establish Membership</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
