import type { CustomRecipePreset } from "../../../../types/coffee";

/**
 * Interface for custom recipe preset repository
 * Abstracts storage implementation for custom recipe preset management
 */
export interface ICustomRecipePresetRepository {
  /**
   * Get all custom recipe presets from storage
   * @returns Array of all custom recipe presets
   */
  findAll(): CustomRecipePreset[];

  /**
   * Find a preset by ID
   * @param id - The preset ID
   * @returns The preset or undefined if not found
   */
  findById(id: string): CustomRecipePreset | undefined;

  /**
   * Save a preset (create or update)
   * @param preset - The preset to save
   */
  save(preset: CustomRecipePreset): void;

  /**
   * Save multiple presets at once
   * @param presets - Array of presets to save
   */
  saveAll(presets: CustomRecipePreset[]): void;

  /**
   * Delete a preset by ID
   * @param id - The preset ID
   */
  delete(id: string): void;

  /**
   * Delete all presets
   */
  deleteAll(): void;

  /**
   * Check if a preset exists
   * @param id - The preset ID
   * @returns True if the preset exists
   */
  exists(id: string): boolean;

  /**
   * Count all presets
   * @returns Number of presets
   */
  count(): number;
}
