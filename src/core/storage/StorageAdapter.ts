/**
 * Storage adapter interface for abstracting storage mechanisms
 * Allows for easy swapping between localStorage, sessionStorage, IndexedDB, etc.
 */
export interface StorageAdapter {
  /**
   * Get an item from storage
   * @param key - The storage key
   * @returns The stored value or null if not found
   */
  getItem(key: string): string | null;

  /**
   * Set an item in storage
   * @param key - The storage key
   * @param value - The value to store
   */
  setItem(key: string, value: string): void;

  /**
   * Remove an item from storage
   * @param key - The storage key
   */
  removeItem(key: string): void;

  /**
   * Clear all items from storage
   */
  clear(): void;

  /**
   * Get all keys in storage
   * @returns Array of storage keys
   */
  keys(): string[];
}
