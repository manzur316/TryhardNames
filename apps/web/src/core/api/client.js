import { API_BASE_URL, API_TIMEOUT } from '../constants/index.js';

export const apiClient = {
  request: async (endpoint, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(id);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(id);
      console.warn('API Request failed:', error);
      return null;
    }
  },
  
  get: (endpoint, options = {}) => 
    apiClient.request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint, body, options = {}) => 
    apiClient.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
  put: (endpoint, body, options = {}) => 
    apiClient.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
  delete: (endpoint, options = {}) => 
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),
};