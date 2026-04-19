/**
 * Base abstract class for storage providers.
 * Defines the standard interface that all storage implementations must follow.
 * @abstract
 */
export class StorageProvider {
  /**
   * Retrieves a value by its key.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<any>} The parsed value or null if not found.
   * @throws {Error} If not implemented.
   */
  async get(key) {
    throw new Error('StorageProvider.get() must be implemented');
  }

  /**
   * Stores a value under a specific key.
   * @param {string} key - The key to store the value under.
   * @param {any} value - The value to store (will be serialized).
   * @returns {Promise<boolean>} True if successful, false otherwise.
   * @throws {Error} If not implemented.
   */
  async set(key, value) {
    throw new Error('StorageProvider.set() must be implemented');
  }

  /**
   * Removes a value by its key.
   * @param {string} key - The key to remove.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   * @throws {Error} If not implemented.
   */
  async remove(key) {
    throw new Error('StorageProvider.remove() must be implemented');
  }

  /**
   * Clears all values managed by this provider (respecting namespaces).
   * @returns {Promise<boolean>} True if successful, false otherwise.
   * @throws {Error} If not implemented.
   */
  async clear() {
    throw new Error('StorageProvider.clear() must be implemented');
  }

  /**
   * Retrieves all values whose keys start with a specific prefix.
   * @param {string} prefix - The prefix to search for.
   * @returns {Promise<Object<string, any>>} A dictionary of key-value pairs.
   * @throws {Error} If not implemented.
   */
  async getAll(prefix) {
    throw new Error('StorageProvider.getAll() must be implemented');
  }

  /**
   * Checks if a key exists in the storage.
   * @param {string} key - The key to check.
   * @returns {Promise<boolean>} True if the key exists, false otherwise.
   * @throws {Error} If not implemented.
   */
  async exists(key) {
    throw new Error('StorageProvider.exists() must be implemented');
  }
}