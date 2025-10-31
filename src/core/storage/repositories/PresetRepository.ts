import type { FourSixPreset, CustomRecipePreset } from '../../../types/coffee';
import type { StorageAdapter } from '../StorageAdapter';
import { BaseRepository } from './BaseRepository';

/**
 * Default FourSix presets
 */
export const defaultFourSixPresets: FourSixPreset[] = [
  {
    id: 'default-46',
    name: 'Original 4:6',
    isDefault: true,
    drawdownTime: 75, // 1:15 drawdown after last pour at 2:15
    pours: [
      { amount: 50, timeSeconds: 0 },
      { amount: 70, timeSeconds: 45 },
      { amount: 90, timeSeconds: 90 },
      { amount: 90, timeSeconds: 135 },
    ],
  },
  {
    id: 'gentle-46',
    name: 'Gentle (5 pours)',
    isDefault: true,
    drawdownTime: 90, // 1:30 drawdown after last pour at 2:30
    pours: [
      { amount: 60, timeSeconds: 0 },
      { amount: 60, timeSeconds: 45 },
      { amount: 60, timeSeconds: 90 },
      { amount: 60, timeSeconds: 120 },
      { amount: 60, timeSeconds: 150 },
    ],
  },
  {
    id: 'bold-46',
    name: 'Bold (3 pours)',
    isDefault: true,
    drawdownTime: 60, // 1:00 drawdown after last pour at 2:00
    pours: [
      { amount: 120, timeSeconds: 0 },
      { amount: 90, timeSeconds: 60 },
      { amount: 90, timeSeconds: 120 },
    ],
  },
];

/**
 * Repository for FourSix presets
 */
export class FourSixPresetRepository extends BaseRepository<FourSixPreset> {
  constructor(storage: StorageAdapter) {
    super('coffee-brew-46-presets', storage);
  }

  /**
   * Get all presets including default presets
   * @returns Array of all FourSix presets
   */
  findAll(): FourSixPreset[] {
    const customPresets = super.findAll();
    return [...defaultFourSixPresets, ...customPresets];
  }

  /**
   * Get only custom (non-default) presets
   * @returns Array of custom presets
   */
  findCustom(): FourSixPreset[] {
    return super.findAll();
  }

  /**
   * Save a preset (only custom presets can be saved)
   * @param preset - The preset to save
   */
  save(preset: FourSixPreset): void {
    // Ensure it's not marked as default when saving
    const customPreset = { ...preset, isDefault: false };
    super.save(customPreset);
  }

  /**
   * Delete a preset (only custom presets can be deleted)
   * @param id - The preset ID
   */
  delete(id: string): void {
    // Prevent deletion of default presets
    const preset = this.findById(id);
    if (preset?.isDefault) {
      throw new Error('Cannot delete default presets');
    }
    super.delete(id);
  }
}

/**
 * Repository for custom recipe presets
 */
export class CustomRecipePresetRepository extends BaseRepository<CustomRecipePreset> {
  constructor(storage: StorageAdapter) {
    super('coffee-custom-presets', storage);
  }
}
