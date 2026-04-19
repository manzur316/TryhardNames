import { useState, useCallback } from 'react';
import { apiClient } from '../api/index.js';

export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint, method = 'GET', body = null, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (method === 'GET') result = await apiClient.get(endpoint, options);
      else if (method === 'POST') result = await apiClient.post(endpoint, body, options);
      else if (method === 'PUT') result = await apiClient.put(endpoint, body, options);
      else if (method === 'DELETE') result = await apiClient.delete(endpoint, options);
      
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      console.warn('useApi error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};