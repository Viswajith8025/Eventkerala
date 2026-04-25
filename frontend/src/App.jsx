import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import 'nprogress/nprogress.css';

// Route-based Code Splitting
const Home = lazy(() => import('./pages/Home'));
const Places = lazy(() => import('./pages/Places'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const SharedJourney = lazy(() => import('./pages/SharedJourney'));
const HeritageMatchmaker = lazy(() => import('./pages/SoulSync'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));


// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF]">
    <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function App() {
  const location = useLocation();

  useEffect(() => {
    // NProgress configuration
    NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.15 });
    
    const handleStart = () => NProgress.start();
    const handleDone = () => NProgress.done();

    // Hook into router navigation events
    handleStart();
    const timeout = setTimeout(handleDone, 500);
    return () => clearTimeout(timeout);
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') return;

    const socket = io(API_URL.replace('/api/v1', ''));

    socket.on('new_event', (data) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white/90 backdrop-blur-xl shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border border-indigo-100`}>
          <div className="flex-1 w-0 p-1">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-full text-white font-bold text-xs ring-4 ring-indigo-50">
                  NEW
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-black text-gray-900 font-display">
                  New Event in {data.district}!
                </p>
                <p className="mt-1 text-sm text-gray-500 font-medium line-clamp-1">
                  {data.title}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-100 pl-4 ml-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-2 flex items-center justify-center text-xs font-bold text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    });

    // Request location if logged in
    const requestLocation = async () => {
      if (token && !localStorage.getItem('userLocation')) {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              localStorage.setItem('userLocation', JSON.stringify({ lat: latitude, lng: longitude }));
              toast.success('Location synchronized for heritage discovery', {
                icon: '📍',
                style: { borderRadius: '1rem', background: '#064e3b', color: '#fbbf24', fontWeight: 'bold' }
              });
            },
            () => {
              console.log('Location access denied');
            }
          );
        }
      }
    };

    requestLocation();

    return () => socket.disconnect();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen relative">
              <Toaster position="top-right" />
              <ScrollToTop />
              {!['/login', '/register'].includes(location.pathname) && <Navbar />}
              <main className="flex-grow bg-[#FDFDFF] relative">

                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/places" element={<Places />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/soulsync" element={<HeritageMatchmaker />} />
                    <Route path="/share/:code" element={<SharedJourney />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/create-event" element={<CreateEvent />} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                  </Routes>
                </Suspense>
              </main>
              {!['/login', '/register'].includes(location.pathname) && <Footer />}
              <WhatsAppButton />
            </div>
          </WishlistProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
