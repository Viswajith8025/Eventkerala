import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ events: [], places: [] });
  const [followedDistricts, setFollowedDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage immediately, then sync with backend
  useEffect(() => {
    const saved = localStorage.getItem('livekeralam_wishlist');
    if (saved) setWishlist(JSON.parse(saved));

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token && token !== 'null') {
        try {
          const response = await api.get('/user/me');
          if (response.data.success) {
              setWishlist(prev => ({ 
                  ...prev, 
                  events: response.data.data.wishlist 
              }));
              setFollowedDistricts(response.data.data.followedDistricts || []);
          }
        } catch (err) {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } else {
            console.error('Error syncing wishlist:', err);
          }
        }


      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    localStorage.setItem('livekeralam_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleEvent = async (event) => {
    const token = localStorage.getItem('token');
    const isExist = wishlist.events.find(e => e._id === event._id);

    // Optimistic UI Update
    setWishlist(prev => {
      if (isExist) {
        return { ...prev, events: prev.events.filter(e => e._id !== event._id) };
      }
      return { ...prev, events: [...prev.events, event] };
    });

    // Backend Sync
    if (token && token !== 'null') {
      try {
        await api.post(`/user/wishlist/${event._id}`);
        toast.success(isExist ? 'Removed from your legends' : 'Added to your legends', {
            icon: '✨',
            style: { background: '#064e3b', color: '#fff', borderRadius: '1rem' }
        });
      } catch (err) {
        console.error('Sync failed:', err);
        // Revert on failure
        setWishlist(prev => isExist ? { ...prev, events: [...prev.events, event] } : { ...prev, events: prev.events.filter(e => e._id !== event._id) });
      }
    }
  };

  const togglePlace = (place) => {
    // Places logic remains local for now
    setWishlist(prev => {
      const isExist = prev.places.find(p => p._id === place._id);
      if (isExist) {
        return { ...prev, places: prev.places.filter(p => p._id !== place._id) };
      }
      return { ...prev, places: [...prev.places, place] };
    });
  };

  const toggleDistrictFollow = async (district) => {
      const token = localStorage.getItem('token');
      const isFollowing = followedDistricts.includes(district);

      // Optimistic UI
      setFollowedDistricts(prev => 
          isFollowing ? prev.filter(d => d !== district) : [...prev, district]
      );

      if (token && token !== 'null') {
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

export const useWishlist = () => useContext(WishlistContext);

