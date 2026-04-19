import { validateName, validateId } from '../validators/index.js';
import { transformName, transformArray } from '../transformers/index.js';

/**
 * Repository for managing stylish text names.
 */
export class NamesRepository {
  constructor(storageProvider) {
    this.provider = storageProvider;
    this.storageKey = 'savedStylishTexts';
  }

  /**
   * Retrieves all saved names.
   * @returns {Promise<Array>} Array of name objects.
   */
  async getAll() {
    try {
      const data = await this.provider.get(this.storageKey);
      return Array.isArray(data) ? transformArray(data, transformName) : [];
    } catch (error) {
      console.error('NamesRepository.getAll error:', error);
      return [];
    }
  }

  /**
   * Retrieves a specific name by ID.
   * @param {string} id 
   * @returns {Promise<Object|null>} The name object or null.
   */
  async getById(id) {
    try {
      validateId(id);
      const all = await this.getAll();
      return all.find(item => item.id === id) || null;
    } catch (error) {
      console.error('NamesRepository.getById error:', error);
      return null;
    }
  }

  /**
   * Saves a new name.
   * @param {Object} nameData 
   * @returns {Promise<Object|null>} The saved name object.
   */
  async save(nameData) {
    try {
      validateName(nameData);
      const transformed = transformName(nameData);
      const all = await this.getAll();
      
      // Keep only the latest 20 saved texts
      const updated = [transformed, ...all].slice(0, 20);
      await this.provider.set(this.storageKey, updated);
      return transformed;
    } catch (error) {
      console.error('NamesRepository.save error:', error);
      return null;
    }
  }

  /**
   * Updates an existing name.
   * @param {string} id 
   * @param {Object} updates 
   * @returns {Promise<Object|null>} The updated name object.
   */
  async update(id, updates) {
    try {
      validateId(id);
      const all = await this.getAll();
      const index = all.findIndex(item => item.id === id);
      if (index === -1) return null;

      const updatedItem = transformName({ ...all[index], ...updates, updatedAt: new Date().toISOString() });
      all[index] = updatedItem;
      
      await this.provider.set(this.storageKey, all);
      return updatedItem;
    } catch (error) {
      console.error('NamesRepository.update error:', error);
      return null;
    }
  }

  /**
   * Deletes a name by ID.
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
      console.error('NamesRepository.delete error:', error);
      return false;
    }
  }

  /**
   * Deletes all saved names.
   * @returns {Promise<boolean>} True if successful.
   */
  async deleteAll() {
    try {
      await this.provider.remove(this.storageKey);
      return true;
    } catch (error) {
      console.error('NamesRepository.deleteAll error:', error);
      return false;
    }
  }

  /**
   * Returns the total count of saved names.
   * @returns {Promise<number>}
   */
  async count() {
    const all = await this.getAll();
    return all.length;
  }

  /**
   * Searches names by text or style.
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async search(query) {
    if (!query) return await this.getAll();
    const all = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return all.filter(item => 
      item.text.toLowerCase().includes(lowerQuery) || 
      item.style.toLowerCase().includes(lowerQuery)
    );
  }
}