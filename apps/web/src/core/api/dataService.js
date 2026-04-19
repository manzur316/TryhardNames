import { apiClient } from './client.js';
import { hybridCache } from '../cache/hybridCache.js';
import { errorService } from '../services/errorService.js';

class DataService {
  constructor() {
    this.requestInProgress = new Map();
  }

  _getCacheKey(endpoint, page, limit, category, search) {
    return hybridCache.generateKey(endpoint, { page, limit, category, search });
  }

  clearCache(endpoint = null) {
    hybridCache.clear(endpoint);
  }

  getCacheStats() {
    return {
      ...hybridCache.getStats(),
      inFlight: this.requestInProgress.size
    };
  }

  async _fetchData(endpoint, page = 1, limit = 50, category = '', search = '') {
    const key = this._getCacheKey(endpoint, page, limit, category, search);
    
    // 1. Check Hybrid Cache
    const cachedData = hybridCache.get(key);
    if (cachedData) {
      return cachedData;
    }

    // 2. Check In-Flight Requests (Deduplication)
    if (this.requestInProgress.has(key)) {
      return this.requestInProgress.get(key);
    }

    // 3. Fetch Data
    const fetchPromise = (async () => {
      let url = `${endpoint}?page=${page}&limit=${limit}`;
      if (category && category !== 'All') {
        url += `&category=${encodeURIComponent(category)}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      try {
        const response = await apiClient.get(url);
        if (response && response.success) {
          hybridCache.set(key, response);
          return response;
        }
        throw new Error('Invalid response format');
      } catch (error) {
        const apiError = errorService.createApiError(error, `Failed to fetch ${endpoint}`);
        errorService.logError(apiError, { endpoint, page, limit, category, search });
        throw apiError;
      } finally {
        this.requestInProgress.delete(key);
      }
    })();

    this.requestInProgress.set(key, fetchPromise);
    return fetchPromise;
  }

  async getStyles(page = 1, limit = 50, category = '', search = '') {
    return this._fetchData('/data/styles', page, limit, category, search);
  }

  async getSymbols(page = 1, limit = 50, category = '', search = '') {
    return this._fetchData('/data/symbols', page, limit, category, search);
  }

  async getColors(page = 1, limit = 50, category = '', search = '') {
    return this._fetchData('/data/colors', page, limit, category, search);
  }
}

export const dataService = new DataService();