import type { FourSixPreset } from "../../../../types/coffee";

/**
 * Interface for FourSix preset repository
 * Abstracts storage implementation for FourSix preset management
 */
export interface IFourSixPresetRepository {
  /**
   * Get all presets including default presets
   * @returns Array of all FourSix presets
   */
  findAll(): FourSixPreset[];

  /**
   * Get only custom (non-default) presets
   * @returns Array of custom presets
   */
  findCustom(): FourSixPreset[];

  /**
   * Find a preset by ID
   * @param id - The preset ID
   * @returns The preset or undefined if not found
   */
  findById(id: string): FourSixPreset | undefined;

  /**
   * Save a preset (only custom presets can be saved)
   * @param preset - The preset to save
   */
  save(preset: FourSixPreset): void;

  /**
   * Save multiple presets at once
   * @param presets - Array of presets to save
   */
  saveAll(presets: FourSixPreset[]): void;

  /**
   * Delete a preset (only custom presets can be deleted)
   * @param id - The preset ID
   */
  delete(id: string): void;

  /**
   * Delete all custom presets
   */
  deleteAll(): void;

  /**
   * Check if a preset exists
   * @param id - The preset ID
   * @returns True if the preset exists
   */
  exists(id: string): boolean;

  /**
   * Count all presets (including defaults)
   * @returns Number of presets
   */
  count(): number;
}
