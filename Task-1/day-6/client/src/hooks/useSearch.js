import { useState, useEffect, useCallback } from 'react';
import { search as apiSearch, getSearchSuggestions } from '../services/api';
import { cacheData, getCachedData } from '../utils/cache';

const CACHE_KEY = 'search_';
const CACHE_DURATION = 5 * 60 * 1000;

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ items: [], folders: [], total: 0 });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (searchQuery, type = null) => {
    if (!searchQuery.trim()) {
      setResults({ items: [], folders: [], total: 0 });
      return;
    }

    const cacheKey = `${CACHE_KEY}${searchQuery}_${type || 'all'}`;
    const cached = await getCachedData(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setResults(cached.results);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiSearch(searchQuery, type);
      if (response.success) {
        setResults(response.data);
        await cacheData(cacheKey, {
          results: response.data,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      setError(err.message);
      if (cached) {
        setResults(cached.results);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await getSearchSuggestions(searchQuery);
      if (response.success) {
        setSuggestions(response.data);
      }
    } catch (err) {
      console.error('Suggestions error:', err);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults({ items: [], folders: [], total: 0 });
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    suggestions,
    loading,
    error,
    performSearch,
    fetchSuggestions,
    clearSearch
  };
};

export default useSearch;
