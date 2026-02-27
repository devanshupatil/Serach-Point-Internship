import { useState, useCallback } from 'react';
import { search as apiSearch, getSearchSuggestions } from '../services/api';

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

    setLoading(true);
    setError(null);

    try {
      // Local storage search is synchronous but we keep the async structure for compatibility
      const response = await apiSearch(searchQuery, type);
      if (response.success) {
        setResults(response.data);
      }
    } catch (err) {
      setError(err.message);
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
