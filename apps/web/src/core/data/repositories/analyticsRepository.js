import { validateAnalyticsEvent, validateId } from '../validators/index.js';
import { transformAnalyticsEvent, transformArray } from '../transformers/index.js';

/**
 * Repository for managing analytics events.
 */
export class AnalyticsRepository {
  constructor(storageProvider) {
    this.provider = storageProvider;
    this.storageKey = 'analyticsEvents';
  }

  async getAll() {
    try {
      const data = await this.provider.get(this.storageKey);
      return Array.isArray(data) ? transformArray(data, transformAnalyticsEvent) : [];
    } catch (error) {
      console.error('AnalyticsRepository.getAll error:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      validateId(id);
      const all = await this.getAll();
      return all.find(item => item.id === id) || null;
    } catch (error) {
      console.error('AnalyticsRepository.getById error:', error);
      return null;
    }
  }

  async getByType(type) {
    try {
      if (!type) throw new Error('Type is required');
      const all = await this.getAll();
      return all.filter(event => event.type === type);
    } catch (error) {
      console.error('AnalyticsRepository.getByType error:', error);
      return [];
    }
  }

  async save(eventData) {
    try {
      validateAnalyticsEvent(eventData);
      const transformed = transformAnalyticsEvent(eventData);
      const all = await this.getAll();
      
      const updated = [...all, transformed];
      await this.provider.set(this.storageKey, updated);
      return transformed;
    } catch (error) {
      console.error('AnalyticsRepository.save error:', error);
      return null;
    }
  }

  async saveBatch(eventsList) {
    try {
      if (!Array.isArray(eventsList)) throw new Error('eventsList must be an array');
      
      const validEvents = eventsList.filter(e => {
        try { validateAnalyticsEvent(e); return true; } catch { return false; }
      });
      
      const transformedEvents = transformArray(validEvents, transformAnalyticsEvent);
      const all = await this.getAll();
      
      const updated = [...all, ...transformedEvents];
      await this.provider.set(this.storageKey, updated);
      return transformedEvents;
    } catch (error) {
      console.error('AnalyticsRepository.saveBatch error:', error);
      return [];
    }
  }

  async delete(id) {
    try {
      validateId(id);
      const all = await this.getAll();
      const filtered = all.filter(item => item.id !== id);
      await this.provider.set(this.storageKey, filtered);
      return true;
    } catch (error) {
      console.error('AnalyticsRepository.delete error:', error);
      return false;
    }
  }

  async deleteOlderThan(days) {
    try {
      if (typeof days !== 'number' || days < 0) throw new Error('Days must be a positive number');
      const all = await this.getAll();
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const filtered = all.filter(event => new Date(event.timestamp) >= cutoffDate);
      await this.provider.set(this.storageKey, filtered);
      return true;
    } catch (error) {
      console.error('AnalyticsRepository.deleteOlderThan error:', error);
      return false;
    }
  }

  async deleteAll() {
    try {
      await this.provider.remove(this.storageKey);
      return true;
    } catch (error) {
      console.error('AnalyticsRepository.deleteAll error:', error);
      return false;
    }
  }

  async count() {
    const all = await this.getAll();
    return all.length;
  }

  async countByType(type) {
    const events = await this.getByType(type);
    return events.length;
  }

  async getByDateRange(startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const all = await this.getAll();
      
      return all.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= start && eventDate <= end;
      });
    } catch (error) {
      console.error('AnalyticsRepository.getByDateRange error:', error);
      return [];
    }
  }
}