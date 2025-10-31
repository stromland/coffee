import type { FourSixPreset, CustomRecipePreset } from '../../types/coffee';
import { FourSixPresetRepository, CustomRecipePresetRepository } from '../storage/repositories';
import { localStorageAdapter } from '../storage/LocalStorageAdapter';

/**
 * Unified preset management service
 * Consolidates logic from presetStorage.ts and customRecipeStorage.ts
 */
export class PresetService {
  private fourSixRepo: FourSixPresetRepository;
  private customRecipeRepo: CustomRecipePresetRepository;

  constructor() {
    this.fourSixRepo = new FourSixPresetRepository(localStorageAdapter);
    this.customRecipeRepo = new CustomRecipePresetRepository(localStorageAdapter);
  }

  // ===== FourSix Preset Methods =====

  /**
   * Load all FourSix presets (default + custom)
   */
  loadFourSixPresets(): FourSixPreset[] {
    return this.fourSixRepo.findAll();
  }

  /**
   * Get a FourSix preset by ID
   */
  getFourSixPresetById(presetId: string): FourSixPreset | undefined {
    return this.fourSixRepo.findById(presetId);
  }

  /**
   * Save a FourSix preset
   */
  saveFourSixPreset(preset: FourSixPreset): void {
    this.fourSixRepo.save(preset);
  }

  /**
   * Delete a FourSix preset
   */
  deleteFourSixPreset(presetId: string): void {
    this.fourSixRepo.delete(presetId);
  }

  // ===== Custom Recipe Preset Methods =====

  /**
   * Load all custom recipe presets
   */
  loadCustomRecipePresets(): CustomRecipePreset[] {
    return this.customRecipeRepo.findAll();
  }

  /**
   * Get a custom recipe preset by ID
   */
  getCustomRecipePresetById(presetId: string): CustomRecipePreset | undefined {
    return this.customRecipeRepo.findById(presetId);
  }

  /**
   * Save a custom recipe preset
   */
  saveCustomRecipePreset(preset: CustomRecipePreset): void {
    this.customRecipeRepo.save(preset);
  }

  /**
   * Delete a custom recipe preset
   */
  deleteCustomRecipePreset(presetId: string): void {
    this.customRecipeRepo.delete(presetId);
  }

  // ===== Unified Methods =====

  /**
   * Get any preset by ID (searches both FourSix and Custom Recipe)
   */
  getPresetById(presetId: string): FourSixPreset | CustomRecipePreset | undefined {
    return this.getFourSixPresetById(presetId) || this.getCustomRecipePresetById(presetId);
  }

  /**
   * Check if a preset exists
   */
  presetExists(presetId: string): boolean {
    return this.fourSixRepo.exists(presetId) || this.customRecipeRepo.exists(presetId);
  }
}

/**
 * Singleton instance of PresetService
 */
export const presetService = new PresetService();
