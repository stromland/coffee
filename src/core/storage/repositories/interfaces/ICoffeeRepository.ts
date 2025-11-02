import type { Coffee } from "../../../../types/coffee";

/**
 * Interface for coffee repository
 * Abstracts storage implementation for coffee management
 */
export interface ICoffeeRepository {
  /**
   * Get all coffees (default + custom)
   * @returns Array of all coffees
   */
  findAll(): Coffee[];

  /**
   * Get only default (built-in) coffees
   * @returns Array of default coffees
   */
  findDefaults(): Coffee[];

  /**
   * Get only custom (user-created) coffees
   * @returns Array of custom coffees
   */
  findCustom(): Coffee[];

  /**
   * Find a coffee by ID
   * @param id - The coffee ID
   * @returns The coffee or undefined if not found
   */
  findById(id: string): Coffee | undefined;

  /**
   * Save a coffee (only custom coffees can be saved)
   * @param coffee - The coffee to save
   */
  save(coffee: Coffee): void;

  /**
   * Delete a coffee (only custom coffees can be deleted)
   * @param id - The coffee ID
   */
  delete(id: string): void;

  /**
   * Check if a coffee exists
   * @param id - The coffee ID
   * @returns True if the coffee exists
   */
  exists(id: string): boolean;

  /**
   * Count all coffees (including defaults)
   * @returns Number of coffees
   */
  count(): number;
}
