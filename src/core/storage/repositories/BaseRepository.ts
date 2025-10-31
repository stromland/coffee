import type { StorageAdapter } from '../StorageAdapter';

/**
 * Base repository providing generic CRUD operations
 * All repositories should extend this class
 */
export abstract class BaseRepository<T extends { id: string }> {
  protected storageKey: string;
  protected storage: StorageAdapter;

  constructor(storageKey: string, storage: StorageAdapter) {
    this.storageKey = storageKey;
    this.storage = storage;
  }

  /**
   * Get all items from storage
   * @returns Array of all items
   */
  findAll(): T[] {
    try {
      const stored = this.storage.getItem(this.storageKey);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as T[];
    } catch (error) {
      console.error(`Failed to load items from ${this.storageKey}:`, error);
      return [];
    }
  }

  /**
   * Find an item by ID
   * @param id - The item ID
   * @returns The item or undefined if not found
   */
  findById(id: string): T | undefined {
    return this.findAll().find(item => item.id === id);
  }

  /**
   * Save an item (create or update)
   * @param item - The item to save
   */
  save(item: T): void {
    try {
      const items = this.findAll();
      const existingIndex = items.findIndex(i => i.id === item.id);
      
      if (existingIndex !== -1) {
        // Update existing item
        items[existingIndex] = item;
      } else {
        // Add new item
        items.push(item);
      }
      
      this.storage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Failed to save item to ${this.storageKey}:`, error);
      throw new Error('Failed to save item');
    }
  }

  /**
   * Save multiple items at once
   * @param items - Array of items to save
   */
  saveAll(items: T[]): void {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Failed to save items to ${this.storageKey}:`, error);
      throw new Error('Failed to save items');
    }
  }

  /**
   * Delete an item by ID
   * @param id - The item ID
   */
  delete(id: string): void {
    try {
      const items = this.findAll().filter(item => item.id !== id);
      this.storage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Failed to delete item from ${this.storageKey}:`, error);
      throw new Error('Failed to delete item');
    }
  }

  /**
   * Delete all items
   */
  deleteAll(): void {
    try {
      this.storage.removeItem(this.storageKey);
    } catch (error) {
      console.error(`Failed to clear ${this.storageKey}:`, error);
      throw new Error('Failed to clear items');
    }
  }

  /**
   * Check if an item exists
   * @param id - The item ID
   * @returns True if the item exists
   */
  exists(id: string): boolean {
    return this.findById(id) !== undefined;
  }

  /**
   * Count all items
   * @returns Number of items
   */
  count(): number {
    return this.findAll().length;
  }
}
