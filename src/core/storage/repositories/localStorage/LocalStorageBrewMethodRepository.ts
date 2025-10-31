import type { BrewMethod } from "../../../../types/coffee";
import type { IBrewMethodRepository } from "../interfaces/IBrewMethodRepository";
import { BaseRepository } from "./BaseRepository";

/**
 * Default brew methods
 */
export const defaultBrewMethods: BrewMethod[] = [
  // 4:6 Method variants
  {
    id: "4-6-original",
    name: "Original 4:6",
    description: "Tetsu Kasuya's original 4:6 method",
    category: "4:6 Method",
    creditName: "Tetsu Kasuya (2016 World Brewers Cup Champion)",
    creditUrl: "https://projectbarista.com/4-6-method-recipe/",
    drawdownTime: 75,
    pours: [
      { percentage: 16.67, atTimeSeconds: 0, description: "40% phase - affects sweetness" },
      { percentage: 23.33, atTimeSeconds: 45, description: "40% phase - affects sweetness" },
      { percentage: 30, atTimeSeconds: 90, description: "60% phase - affects strength" },
      { percentage: 30, atTimeSeconds: 135, description: "60% phase - affects strength" },
    ],
    isDefault: true,
    isCustom: false,
  },
  {
    id: "4-6-gentle",
    name: "Gentle (5 pours)",
    description: "Gentler extraction with 5 equal pours",
    category: "4:6 Method",
    creditName: "Tetsu Kasuya (2016 World Brewers Cup Champion)",
    creditUrl: "https://projectbarista.com/4-6-method-recipe/",
    drawdownTime: 90,
    pours: [
      { percentage: 20, atTimeSeconds: 0, description: "40% phase - affects sweetness" },
      { percentage: 20, atTimeSeconds: 45, description: "40% phase - affects sweetness" },
      { percentage: 20, atTimeSeconds: 90, description: "60% phase - affects strength" },
      { percentage: 20, atTimeSeconds: 120, description: "60% phase - affects strength" },
      { percentage: 20, atTimeSeconds: 150, description: "60% phase - affects strength" },
    ],
    isDefault: true,
    isCustom: false,
  },
  {
    id: "4-6-bold",
    name: "Bold (3 pours)",
    description: "Stronger extraction with 3 larger pours",
    category: "4:6 Method",
    creditName: "Tetsu Kasuya (2016 World Brewers Cup Champion)",
    creditUrl: "https://projectbarista.com/4-6-method-recipe/",
    drawdownTime: 60,
    pours: [
      { percentage: 40, atTimeSeconds: 0, description: "40% phase - affects sweetness" },
      { percentage: 30, atTimeSeconds: 60, description: "60% phase - affects strength" },
      { percentage: 30, atTimeSeconds: 120, description: "60% phase - affects strength" },
    ],
    isDefault: true,
    isCustom: false,
  },
  // James Hoffmann method
  {
    id: "hoffman-1cup",
    name: "Hoffman 1 Cup V60",
    description: "James Hoffmann's 1 Cup V60 method with bloom and progressive pours",
    category: "James Hoffmann",
    creditName: "James Hoffmann",
    creditUrl: "https://www.youtube.com/watch?v=1oB1oDrDkHM",
    drawdownTime: 70,
    pours: [
      { percentage: 20, atTimeSeconds: 0, description: "Bloom - swirl gently at 10-15s" },
      { percentage: 20, atTimeSeconds: 45, description: "Continue pouring" },
      { percentage: 20, atTimeSeconds: 70, description: "Continue pouring" },
      { percentage: 20, atTimeSeconds: 90, description: "Continue pouring" },
      { percentage: 20, atTimeSeconds: 110, description: "Final pour - swirl at 2:00" },
    ],
    isDefault: true,
    isCustom: false,
  },
  // Simple methods
  {
    id: "single-pour",
    name: "Single Pour",
    description: "Simple continuous pour method",
    category: "Simple",
    drawdownTime: 120,
    pours: [
      {
        percentage: 100,
        atTimeSeconds: 0,
        description: "Pour all water in a slow, continuous stream",
      },
    ],
    isDefault: true,
    isCustom: false,
  },
];

/**
 * LocalStorage implementation of brew method repository
 */
export class LocalStorageBrewMethodRepository
  extends BaseRepository<BrewMethod>
  implements IBrewMethodRepository
{
  constructor() {
    super("coffee-brew-methods");
  }

  /**
   * Get all methods including default methods
   */
  findAll(): BrewMethod[] {
    const customMethods = this.loadFromStorage();
    return [...defaultBrewMethods, ...customMethods];
  }

  /**
   * Get only default (built-in) methods
   */
  findDefaults(): BrewMethod[] {
    return defaultBrewMethods;
  }

  /**
   * Get only custom (user-created) methods
   */
  findCustom(): BrewMethod[] {
    return this.loadFromStorage();
  }

  /**
   * Find a method by ID (searches both default and custom)
   */
  findById(id: string): BrewMethod | undefined {
    return this.findAll().find((method) => method.id === id);
  }

  /**
   * Find methods by category
   */
  findByCategory(category: string): BrewMethod[] {
    return this.findAll().filter((method) => method.category === category);
  }

  /**
   * Save a method (only custom methods can be saved)
   */
  save(method: BrewMethod): void {
    // Ensure it's marked as custom when saving
    const customMethod = { ...method, isDefault: false, isCustom: true };

    const items = this.loadFromStorage();
    const existingIndex = items.findIndex((i) => i.id === customMethod.id);

    if (existingIndex !== -1) {
      items[existingIndex] = customMethod;
    } else {
      items.push(customMethod);
    }

    this.saveToStorage(items);
  }

  /**
   * Delete a method (only custom methods can be deleted)
   */
  delete(id: string): void {
    // Prevent deletion of default methods
    const method = this.findById(id);
    if (method?.isDefault) {
      throw new Error("Cannot delete default methods");
    }

    const items = this.loadFromStorage().filter((item) => item.id !== id);
    this.saveToStorage(items);
  }

  /**
   * Count all methods (including defaults)
   */
  count(): number {
    return this.findAll().length;
  }

  /**
   * Check if a method exists (searches both default and custom)
   */
  exists(id: string): boolean {
    return this.findById(id) !== undefined;
  }
}
