class HybridCache {
  constructor() {
    this.memoryCache = new Map();
    this.maxSize = 50;
    this.memoryTTL = 5 * 60 * 1000; // 5 minutes
    this.localTTL = 24 * 60 * 60 * 1000; // 24 hours
    this.prefix = 'hc_';
  }

  generateKey(endpoint, params = {}) {
    const queryString = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    return `${this.prefix}${endpoint}${queryString ? '?' + queryString : ''}`;
  }

  get(key) {
    // 1. Check memory cache
    const memItem = this.memoryCache.get(key);
    if (memItem) {
      if (Date.now() < memItem.expiry) {
        return memItem.data;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check localStorage
    try {
      const localItemStr = localStorage.getItem(key);
      if (localItemStr) {
        const localItem = JSON.parse(localItemStr);
        if (Date.now() < localItem.expiry) {
          // Restore to memory cache for faster subsequent access
          this.memoryCache.set(key, {
            data: localItem.data,
            expiry: Date.now() + this.memoryTTL
          });
          return localItem.data;
        }
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('HybridCache: Error reading from localStorage', error);
    }

    return null;
  }

  set(key, data) {
    this._enforceMaxSize();

    const now = Date.now();
    
    // 1. Set memory cache
    this.memoryCache.set(key, {
      data,
      expiry: now + this.memoryTTL
    });

    // 2. Set localStorage
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        expiry: now + this.localTTL
      }));
    } catch (error) {
      console.warn('HybridCache: Error writing to localStorage (quota exceeded?)', error);
      this._cleanupLocalStorage();
    }
  }

  clear(endpointPrefix = null) {
    if (!endpointPrefix) {
      this.memoryCache.clear();
      this._cleanupLocalStorage(true);
      return;
    }

    const prefix = `${this.prefix}${endpointPrefix}`;
    
    // Clear memory
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear localStorage
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.warn('HybridCache: Error clearing localStorage', error);
    }
  }

  getStats() {
    let localCount = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i)?.startsWith(this.prefix)) {
          localCount++;
        }
      }
    } catch (e) {
      // Ignore
    }

    return {
      memoryItems: this.memoryCache.size,
      localItems: localCount,
      maxSize: this.maxSize
    };
  }

  _enforceMaxSize() {
    if (this.memoryCache.size >= this.maxSize) {
      // Remove oldest entry (Map iterates in insertion order)
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
  }

  _cleanupLocalStorage(all = false) {
    try {
      const keysToRemove = [];
      const now = Date.now();
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          if (all) {
            keysToRemove.push(key);
          } else {
            const itemStr = localStorage.getItem(key);
            if (itemStr) {
              const item = JSON.parse(itemStr);
              if (now >= item.expiry) {
                keysToRemove.push(key);
              }
            }
          }
        }
      }
      
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.warn('HybridCache: Error during localStorage cleanup', error);
    }
  }
}

export const hybridCache = new HybridCache();