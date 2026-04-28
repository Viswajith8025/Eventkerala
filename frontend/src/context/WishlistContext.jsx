import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState({ events: [], places: [] });
  const [followedDistricts, setFollowedDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage immediately, then sync with backend
  useEffect(() => {
    const saved = localStorage.getItem('livekeralam_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved wishlist');
      }
    }

    const fetchUserData = async () => {
      if (token && token !== 'null' && token !== 'undefined') {
        try {
          const response = await api.get('/user/me');
          if (response.data.success) {
            setWishlist(prev => ({ 
              ...prev, 
              events: response.data.data.wishlist || [],
              places: response.data.data.placeWishlist || []
            }));
            setFollowedDistricts(response.data.data.followedDistricts || []);
          }
        } catch (err) {
          console.error('Error syncing wishlist:', err);
        }
      } else {
        // Clear wishlist if not logged in
        setWishlist({ events: [], places: [] });
        setFollowedDistricts([]);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    localStorage.setItem('livekeralam_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleEvent = async (event) => {
    const isExist = wishlist.events.find(e => e._id === event._id);

    // Optimistic UI Update
    setWishlist(prev => {
      if (isExist) {
        return { ...prev, events: prev.events.filter(e => e._id !== event._id) };
      }
      return { ...prev, events: [...prev.events, event] };
    });

    // Backend Sync
    if (token && token !== 'null' && token !== 'undefined') {
      try {
        await api.post(`/user/wishlist/${event._id}`);
        toast.success(isExist ? 'Removed from wishlist' : 'Added to wishlist', {
          icon: '✨',
          style: { background: '#064e3b', color: '#fff', borderRadius: '1rem' }
        });
      } catch (err) {
        console.error('Sync failed:', err);
        toast.error('Sync failed. Reverting changes.');
        // Revert on failure
        setWishlist(prev => isExist ? { ...prev, events: [...prev.events, event] } : { ...prev, events: prev.events.filter(e => e._id !== event._id) });
      }
    }
  };

  const togglePlace = async (place) => {
    const isExist = wishlist.places.find(p => p._id === place._id);

    // Optimistic UI Update
    setWishlist(prev => {
      if (isExist) {
        return { ...prev, places: prev.places.filter(p => p._id !== place._id) };
      }
      return { ...prev, places: [...prev.places, place] };
    });

    // Backend Sync
    if (token && token !== 'null' && token !== 'undefined') {
      try {
        await api.post(`/user/place-wishlist/${place._id}`);
        toast.success(isExist ? 'Removed from wishlist' : 'Added to wishlist', {
          icon: '🏛️',
          style: { background: '#064e3b', color: '#fff', borderRadius: '1rem' }
        });
      } catch (err) {
        console.error('Sync failed:', err);
        toast.error('Sync failed. Reverting changes.');
        // Revert on failure
        setWishlist(prev => isExist ? { ...prev, places: [...prev.places, place] } : { ...prev, places: prev.places.filter(p => p._id !== place._id) });
      }
    }
  };

  const toggleDistrictFollow = async (district) => {
    const isFollowing = followedDistricts.includes(district);

    // Optimistic UI
    setFollowedDistricts(prev => 
      isFollowing ? prev.filter(d => d !== district) : [...prev, district]
    );

    if (token && token !== 'null' && token !== 'undefined') {
      try {
        await api.post('/user/follow-district', { district });
        toast.success(isFollowing ? `Unfollowed ${district}` : `Subscribed to ${district}`, {
          style: { background: '#064e3b', color: '#d4af37', borderRadius: '1rem' }
        });
      } catch (err) {
        setFollowedDistricts(prev => isFollowing ? [...prev, district] : prev.filter(d => d !== district));
      }
    }
  };

  const isInWishlist = (id, type) => {
    if (type === 'event') return wishlist.events.some(e => e._id === id);
    if (type === 'place') return wishlist.places.some(p => p._id === id);
    return false;
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      followedDistricts, 
      toggleEvent, 
      togglePlace, 
      toggleDistrictFollow,
      isInWishlist,
      loading 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined || context === null) {
    // Return a default object to prevent destructuring errors if called outside provider
    return { 
      wishlist: { events: [], places: [] }, 
      followedDistricts: [], 
      isInWishlist: () => false,
      loading: true 
    };
  }
  return context;
};
