import { validateNickname, validateId } from '../validators/index.js';
import { transformNickname, transformArray } from '../transformers/index.js';

/**
 * Repository for managing nickname symbols.
 */
export class NicknamesRepository {
  constructor(storageProvider) {
    this.provider = storageProvider;
    this.storageKey = 'nicknameSymbols';
  }

  /**
   * Retrieves all saved nicknames.
   * @returns {Promise<Array>} Array of nickname objects.
   */
  async getAll() {
    try {
      const data = await this.provider.get(this.storageKey);
      return Array.isArray(data) ? transformArray(data, transformNickname) : [];
    } catch (error) {
      console.error('NicknamesRepository.getAll error:', error);
      return [];
    }
  }

  /**
   * Retrieves a specific nickname by ID.
   * @param {string} id 
   * @returns {Promise<Object|null>} The nickname object or null.
   */
  async getById(id) {
    try {
      validateId(id);
      const all = await this.getAll();
      return all.find(item => item.id === id) || null;
    } catch (error) {
      console.error('NicknamesRepository.getById error:', error);
      return null;
    }
  }

  /**
   * Saves a new nickname.
   * @param {Object} nicknameData 
   * @returns {Promise<Object|null>} The saved nickname object.
   */
  async save(nicknameData) {
    try {
      validateNickname(nicknameData);
      const transformed = transformNickname(nicknameData);
      const all = await this.getAll();
      
      // Keep only the latest 20 saved nicknames
      const updated = [transformed, ...all].slice(0, 20);
      await this.provider.set(this.storageKey, updated);
      return transformed;
    } catch (error) {
      console.error('NicknamesRepository.save error:', error);
      return null;
    }
  }

  /**
   * Updates an existing nickname.
   * @param {string} id 
   * @param {Object} updates 
   * @returns {Promise<Object|null>} The updated nickname object.
   */
  async update(id, updates) {
    try {
      validateId(id);
      const all = await this.getAll();
      const index = all.findIndex(item => item.id === id);
      if (index === -1) return null;

      const updatedItem = transformNickname({ ...all[index], ...updates, updatedAt: new Date().toISOString() });
      all[index] = updatedItem;
      
      await this.provider.set(this.storageKey, all);
      return updatedItem;
    } catch (error) {
      console.error('NicknamesRepository.update error:', error);
      return null;
    }
  }

  /**
   * Deletes a nickname by ID.
   * @param {string} id 
   * @returns {Promise<boolean>} True if successful.
   */
  async delete(id) {
    try {
      validateId(id);
      const all = await this.getAll();
      const filtered = all.filter(item => item.id !== id);
      await this.provider.set(this.storageKey, filtered);
      return true;
    } catch (error) {
      console.error('NicknamesRepository.delete error:', error);
      return false;
    }
  }

  /**
   * Deletes all saved nicknames.
   * @returns {Promise<boolean>} True if successful.
   */
  async deleteAll() {
    try {
      await this.provider.remove(this.storageKey);
      return true;
    } catch (error) {
      console.error('NicknamesRepository.deleteAll error:', error);
      return false;
    }
  }

  /**
   * Returns the total count of saved nicknames.
   * @returns {Promise<number>}
   */
  async count() {
    const all = await this.getAll();
    return all.length;
  }

  /**
   * Searches nicknames by text or symbols.
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async search(query) {
    if (!query) return await this.getAll();
    const all = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return all.filter(item => 
      item.nickname.toLowerCase().includes(lowerQuery) || 
      item.symbols.toLowerCase().includes(lowerQuery)
    );
  }
}