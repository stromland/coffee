import type { BrewMethod } from "../../../../types/coffee";

/**
 * Interface for brew method repository
 * Abstracts storage implementation for brew method management
 */
export interface IBrewMethodRepository {
  /**
   * Get all brew methods (default + custom)
   * @returns Array of all brew methods
   */
  findAll(): BrewMethod[];

  /**
   * Get only default (built-in) methods
   * @returns Array of default methods
   */
  findDefaults(): BrewMethod[];

  /**
   * Get only custom (user-created) methods
   * @returns Array of custom methods
   */
  findCustom(): BrewMethod[];

  /**
   * Find a method by ID
   * @param id - The method ID
   * @returns The method or undefined if not found
   */
  findById(id: string): BrewMethod | undefined;

  /**
   * Find methods by category
   * @param category - The category name
   * @returns Array of methods in the category
   */
  findByCategory(category: string): BrewMethod[];

  /**
   * Save a method (only custom methods can be saved)
   * @param method - The method to save
   */
  save(method: BrewMethod): void;

  /**
   * Save multiple methods at once
   * @param methods - Array of methods to save
   */
  saveAll(methods: BrewMethod[]): void;

  /**
   * Delete a method (only custom methods can be deleted)
   * @param id - The method ID
   */
  delete(id: string): void;

  /**
   * Delete all custom methods
   */
  deleteAll(): void;

  /**
   * Check if a method exists
   * @param id - The method ID
   * @returns True if the method exists
   */
  exists(id: string): boolean;

  /**
   * Count all methods (including defaults)
   * @returns Number of methods
   */
  count(): number;
}
