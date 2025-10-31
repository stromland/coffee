import type { StorageAdapter } from './StorageAdapter';

/**
 * LocalStorage implementation of StorageAdapter
 * Provides a consistent interface for localStorage operations
 */
export class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item with key "${key}":`, error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item with key "${key}":`, error);
      throw new Error(`Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item with key "${key}":`, error);
      throw new Error(`Failed to remove data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw new Error(`Failed to clear storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  keys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Failed to get storage keys:', error);
      return [];
    }
  }
}

/**
 * Singleton instance of LocalStorageAdapter
 */
export const localStorageAdapter = new LocalStorageAdapter();
