import { StorageProvider } from './storageProvider.js';

/**
 * Implementation of StorageProvider using Supabase.
 * Assumes a table structure with 'key' (string, primary key) and 'value' (jsonb) columns.
 */
export class SupabaseProvider extends StorageProvider {
  /**
   * @param {Object} supabaseClient - Initialized Supabase client.
   * @param {string} tableName - The table name to use for storage (acts as namespace).
   */
  constructor(supabaseClient, tableName = 'app_storage') {
    super();
    this._validateConfig(supabaseClient, tableName);
    this.client = supabaseClient;
    this.tableName = tableName;
  }

  _validateConfig(client, tableName) {
    if (!client) throw new Error('SupabaseProvider requires a valid Supabase client');
    if (!tableName || typeof tableName !== 'string') throw new Error('SupabaseProvider requires a valid table name');
  }

  async get(key) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        // PGRST116 is the error code for "Results contain 0 rows" when using .single()
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data ? data.value : null;
    } catch (error) {
      console.error(`SupabaseProvider.get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key, value) {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`SupabaseProvider.set error for key ${key}:`, error);
      return false;
    }
  }

  async remove(key) {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('key', key);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`SupabaseProvider.remove error for key ${key}:`, error);
      return false;
    }
  }

  async clear() {
    try {
      // Delete all rows in the table
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .neq('key', '0'); // Dummy condition to delete all

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('SupabaseProvider.clear error:', error);
      return false;
    }
  }

  async getAll(prefix = '') {
    try {
      let query = this.client.from(this.tableName).select('key, value');
      
      if (prefix) {
        query = query.like('key', `${prefix}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const results = {};
      if (data) {
        data.forEach(item => {
          results[item.key] = item.value;
        });
      }
      return results;
    } catch (error) {
      console.error('SupabaseProvider.getAll error:', error);
      return {};
    }
  }

  async exists(key) {
    try {
      const { count, error } = await this.client
        .from(this.tableName)
        .select('key', { count: 'exact', head: true })
        .eq('key', key);

      if (error) throw error;
      return count > 0;
    } catch (error) {
      console.error(`SupabaseProvider.exists error for key ${key}:`, error);
      return false;
    }
  }
}