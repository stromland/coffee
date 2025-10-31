/**
 * Base repository providing generic CRUD operations for localStorage
 * Helper class for localStorage-based repository implementations
 */
export abstract class BaseRepository<T extends { id: string }> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  /**
   * Get all items from storage
   * @returns Array of all items
   */
  protected loadFromStorage(): T[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
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
   * Save items to storage
   * @param items - Array of items to save
   */
  protected saveToStorage(items: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Failed to save items to ${this.storageKey}:`, error);
      throw new Error(
        `Failed to save data: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Remove storage key
   */
  protected clearStorage(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error(`Failed to clear ${this.storageKey}:`, error);
      throw new Error(
        `Failed to clear storage: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get all items from storage
   * @returns Array of all items
   */
  findAll(): T[] {
    return this.loadFromStorage();
  }

  /**
   * Find an item by ID
   * @param id - The item ID
   * @returns The item or undefined if not found
   */
  findById(id: string): T | undefined {
    return this.loadFromStorage().find((item) => item.id === id);
  }

  /**
   * Save an item (create or update)
   * @param item - The item to save
   */
  save(item: T): void {
    const items = this.loadFromStorage();
    const existingIndex = items.findIndex((i) => i.id === item.id);

    if (existingIndex !== -1) {
      // Update existing item
      items[existingIndex] = item;
    } else {
      // Add new item
      items.push(item);
    }

    this.saveToStorage(items);
  }

  /**
   * Save multiple items at once
   * @param items - Array of items to save
   */
  saveAll(items: T[]): void {
    this.saveToStorage(items);
  }

  /**
   * Delete an item by ID
   * @param id - The item ID
   */
  delete(id: string): void {
    const items = this.loadFromStorage().filter((item) => item.id !== id);
    this.saveToStorage(items);
  }

  /**
   * Delete all items
   */
  deleteAll(): void {
    this.clearStorage();
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
    return this.loadFromStorage().length;
  }
}
