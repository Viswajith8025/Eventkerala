import { useCallback } from 'react';
import api from '../services/api';

/**
 * usePrefetch - Pre-fetches event data on hover for instant page transitions
 * Usage: <div onMouseEnter={() => prefetchEvent(event._id)}>
 */
export const usePrefetch = () => {
  const prefetchEvent = useCallback(async (eventId) => {
    try {
      await api.get(`/events/${eventId}`);
    } catch {
      // Silent fail - prefetch is best effort
    }
  }, []);

  const prefetchEvents = useCallback(async (eventIds) => {
    await Promise.allSettled(
      eventIds.map(id => api.get(`/events/${id}`))
    );
  }, []);

  return { prefetchEvent, prefetchEvents };
};

export default usePrefetch;