import { StorageProvider } from './storageProvider.js';

/**
 * Implementation of StorageProvider using browser's localStorage.
 * Includes namespace support to prevent collisions between different apps/modules.
 */
export class LocalStorageProvider extends StorageProvider {
  /**
   * @param {string} namespace - Prefix for all keys managed by this instance.
   */
  constructor(namespace = 'app') {
    super();
    this._validateNamespace(namespace);
    this.namespace = namespace;
  }

  _validateNamespace(namespace) {
    if (!namespace || typeof namespace !== 'string') {
      throw new Error('LocalStorageProvider requires a valid string namespace');
    }
  }

  _getKey(key) {
    if (!key) throw new Error('Key cannot be empty');
    return `${this.namespace}:${key}`;
  }

  _serialize(value) {
    return JSON.stringify(value);
  }

  _deserialize(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn('Failed to parse localStorage value, returning raw string', e);
      return value;
    }
  }

  async get(key) {
    try {
      const fullKey = this._getKey(key);
      const item = localStorage.getItem(fullKey);
      return this._deserialize(item);
    } catch (error) {
      console.error(`LocalStorageProvider.get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key, value) {
    try {
      const fullKey = this._getKey(key);
      const serialized = this._serialize(value);
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error(`LocalStorageProvider.set error for key ${key}:`, error);
      return false;
    }
  }

  async remove(key) {
    try {
      const fullKey = this._getKey(key);
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error(`LocalStorageProvider.remove error for key ${key}:`, error);
      return false;
    }
  }

  async clear() {
    try {
      const keysToRemove = [];
      const prefix = `${this.namespace}:`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('LocalStorageProvider.clear error:', error);
      return false;
    }
  }

  async getAll(prefix = '') {
    try {
      const results = {};
      const searchPrefix = this._getKey(prefix);
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(searchPrefix)) {
          const originalKey = key.slice(this.namespace.length + 1);
          results[originalKey] = this._deserialize(localStorage.getItem(key));
        }
      }
      return results;
    } catch (error) {
      console.error('LocalStorageProvider.getAll error:', error);
      return {};
    }
  }

  async exists(key) {
    try {
      const fullKey = this._getKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      console.error(`LocalStorageProvider.exists error for key ${key}:`, error);
      return false;
    }
  }
}