import type { CustomRecipePreset, FourSixPreset } from "../../types/coffee";
import type {
  ICustomRecipePresetRepository,
  IFourSixPresetRepository,
} from "../storage/repositories/interfaces";
import { RepositoryFactory } from "../storage/repositories/RepositoryFactory";

/**
 * Unified preset management service
 * Consolidates logic from presetStorage.ts and customRecipeStorage.ts
 */
export class PresetService {
  private fourSixRepo: IFourSixPresetRepository;
  private customRecipeRepo: ICustomRecipePresetRepository;

  constructor(
    fourSixRepo: IFourSixPresetRepository,
    customRecipeRepo: ICustomRecipePresetRepository
  ) {
    this.fourSixRepo = fourSixRepo;
    this.customRecipeRepo = customRecipeRepo;
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
  getPresetById(
    presetId: string
  ): FourSixPreset | CustomRecipePreset | undefined {
    return (
      this.getFourSixPresetById(presetId) ||
      this.getCustomRecipePresetById(presetId)
    );
  }

  /**
   * Check if a preset exists
   */
  presetExists(presetId: string): boolean {
    return (
      this.fourSixRepo.exists(presetId) ||
      this.customRecipeRepo.exists(presetId)
    );
  }
}

/**
 * Singleton instance of PresetService
 */
export const presetService = new PresetService(
  RepositoryFactory.createFourSixPresetRepository(),
  RepositoryFactory.createCustomRecipePresetRepository()
);
