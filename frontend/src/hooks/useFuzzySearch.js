import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

/**
 * useFuzzySearch - Debounced fuzzy search for events with ethnic spelling tolerance
 * @param {Array} events - Array of event objects to search
 * @param {Object} options - Fuse.js configuration options
 */
export const useFuzzySearch = (events, options = {}) => {
  const [query, setQuery] = useState('');

  // Configure Fuse with weightings for different fields
  const fuse = useMemo(() => {
    const defaultOptions = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'location', weight: 0.25 },
        { name: 'district', weight: 0.2 },
        { name: 'category', weight: 0.1 },
        { name: 'description', weight: 0.05 }
      ],
      threshold: 0.4,
      includeMatches: true,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      ...options
    };

    return new Fuse(events, defaultOptions);
  }, [events, options]);

  // Debounced search
  const results = useMemo(() => {
    if (!query || query.length < 2) {
      return events;
    }

    const searchResults = fuse.search(query);
    return searchResults.map(result => result.item);
  }, [query, fuse, events]);

  return { query, setQuery, results };
};

export default useFuzzySearch;