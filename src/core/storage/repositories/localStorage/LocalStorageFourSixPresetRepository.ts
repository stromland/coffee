import type { FourSixPreset } from "../../../../types/coffee";
import type { IFourSixPresetRepository } from "../interfaces/IFourSixPresetRepository";
import { BaseRepository } from "./BaseRepository";

/**
 * Default FourSix presets
 */
export const defaultFourSixPresets: FourSixPreset[] = [
  {
    id: "default-46",
    name: "Original 4:6",
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
    id: "gentle-46",
    name: "Gentle (5 pours)",
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
    id: "bold-46",
    name: "Bold (3 pours)",
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
 * LocalStorage implementation of FourSix preset repository
 */
export class LocalStorageFourSixPresetRepository
  extends BaseRepository<FourSixPreset>
  implements IFourSixPresetRepository
{
  constructor() {
    super("coffee-brew-46-presets");
  }

  /**
   * Get all presets including default presets
   * @returns Array of all FourSix presets
   */
  findAll(): FourSixPreset[] {
    const customPresets = this.loadFromStorage();
    return [...defaultFourSixPresets, ...customPresets];
  }

  /**
   * Get only custom (non-default) presets
   * @returns Array of custom presets
   */
  findCustom(): FourSixPreset[] {
    return this.loadFromStorage();
  }

  /**
   * Find a preset by ID (searches both default and custom presets)
   * @param id - The preset ID
   * @returns The preset or undefined if not found
   */
  findById(id: string): FourSixPreset | undefined {
    return this.findAll().find((preset) => preset.id === id);
  }

  /**
   * Save a preset (only custom presets can be saved)
   * @param preset - The preset to save
   */
  save(preset: FourSixPreset): void {
    // Ensure it's not marked as default when saving
    const customPreset = { ...preset, isDefault: false };

    const items = this.loadFromStorage();
    const existingIndex = items.findIndex((i) => i.id === customPreset.id);

    if (existingIndex !== -1) {
      items[existingIndex] = customPreset;
    } else {
      items.push(customPreset);
    }

    this.saveToStorage(items);
  }

  /**
   * Delete a preset (only custom presets can be deleted)
   * @param id - The preset ID
   */
  delete(id: string): void {
    // Prevent deletion of default presets
    const preset = this.findById(id);
    if (preset?.isDefault) {
      throw new Error("Cannot delete default presets");
    }

    const items = this.loadFromStorage().filter((item) => item.id !== id);
    this.saveToStorage(items);
  }

  /**
   * Count all presets (including defaults)
   * @returns Number of presets
   */
  count(): number {
    return this.findAll().length;
  }

  /**
   * Check if a preset exists (searches both default and custom)
   * @param id - The preset ID
   * @returns True if the preset exists
   */
  exists(id: string): boolean {
    return this.findById(id) !== undefined;
  }
}
