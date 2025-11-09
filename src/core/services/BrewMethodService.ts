import type { BrewMethod, BrewStep } from "../../types/coffee";
import type { IBrewMethodRepository } from "../storage/repositories/interfaces";
import { RepositoryFactory } from "../storage/repositories/RepositoryFactory";

/**
 * Service for managing brew methods
 * Handles CRUD operations and step generation
 */
export class BrewMethodService {
  private methodRepo: IBrewMethodRepository;

  constructor(methodRepo: IBrewMethodRepository) {
    this.methodRepo = methodRepo;
  }

  /**
   * Get all brew methods (default + custom)
   */
  getAllMethods(): BrewMethod[] {
    return this.methodRepo.findAll();
  }

  /**
   * Get only default (built-in) methods
   */
  getDefaultMethods(): BrewMethod[] {
    return this.methodRepo.findDefaults();
  }

  /**
   * Get only custom (user-created) methods
   */
  getCustomMethods(): BrewMethod[] {
    return this.methodRepo.findCustom();
  }

  /**
   * Get a method by ID
   */
  getMethodById(id: string): BrewMethod | undefined {
    return this.methodRepo.findById(id);
  }

  /**
   * Get methods by category
   */
  getMethodsByCategory(category: string): BrewMethod[] {
    return this.methodRepo.findByCategory(category);
  }

  /**
   * Get all unique categories
   */
  getCategories(): string[] {
    const methods = this.getAllMethods();
    const categories = new Set<string>();

    methods.forEach((method) => {
      if (method.category) {
        categories.add(method.category);
      }
    });

    // Add "Custom" category if there are custom methods
    if (this.getCustomMethods().length > 0) {
      categories.add("Custom");
    }

    return Array.from(categories);
  }

  /**
   * Save a brew method
   */
  saveMethod(method: BrewMethod): void {
    // Validate method
    this.validateMethod(method);
    this.methodRepo.save(method);
  }

  /**
   * Delete a brew method (only custom methods)
   */
  deleteMethod(id: string): void {
    this.methodRepo.delete(id);
  }

  /**
   * Delete all custom methods
   */
  deleteAllCustomMethods(): void {
    this.methodRepo.deleteAll();
  }

  /**
   * Check if a method exists
   */
  methodExists(id: string): boolean {
    return this.methodRepo.exists(id);
  }

  /**
   * Generate brew steps from a method
   * @param methodId - The method ID
   * @param totalWater - Total water amount in grams
   * @returns Array of brew steps
   */
  generateSteps(methodId: string, totalWater: number): BrewStep[] {
    const method = this.getMethodById(methodId);

    if (!method) {
      throw new Error(`Method not found: ${methodId}`);
    }

    let cumulativeWater = 0;
    let cumulativeTime = 0;

    const pourSteps = method.pours.map((pour, index) => {
      const waterAmount = (pour.percentage / 100) * totalWater;
      cumulativeWater += waterAmount;

      const step = {
        stepNumber: index + 1,
        waterAmount,
        cumulativeWater,
        timeSeconds: cumulativeTime,
        description: pour.description || `Pour ${index + 1}`,
      };

      cumulativeTime += pour.durationSeconds;

      return step;
    });

    return pourSteps;
  }

  /**
   * Calculate total brew time (sum of all pour durations)
   * @param methodId - The method ID
   * @returns Total brew time in seconds
   */
  calculateTotalBrewTime(methodId: string): number {
    const method = this.getMethodById(methodId);

    if (!method) {
      throw new Error(`Method not found: ${methodId}`);
    }

    return method.pours.reduce((sum, pour) => sum + pour.durationSeconds, 0);
  }

  /**
   * Validate a brew method
   * @param method - The method to validate
   * @throws Error if validation fails
   */
  private validateMethod(method: BrewMethod): void {
    if (!method.id || method.id.trim() === "") {
      throw new Error("Method ID is required");
    }

    if (!method.name || method.name.trim() === "") {
      throw new Error("Method name is required");
    }

    if (!method.pours || method.pours.length === 0) {
      throw new Error("Method must have at least one pour");
    }

    // Validate total percentage is 100%
    const totalPercentage = method.pours.reduce((sum, pour) => sum + pour.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error(
        `Pour percentages must sum to 100% (currently ${totalPercentage.toFixed(1)}%)`
      );
    }

    // Validate each pour
    method.pours.forEach((pour, index) => {
      if (pour.percentage <= 0 || pour.percentage > 100) {
        throw new Error(`Pour ${index + 1}: percentage must be greater than 0 and at most 100`);
      }

      if (pour.durationSeconds <= 0) {
        throw new Error(`Pour ${index + 1}: duration must be greater than 0`);
      }
    });
  }
}

/**
 * Singleton instance of BrewMethodService
 */
export const brewMethodService = new BrewMethodService(
  RepositoryFactory.createBrewMethodRepository()
);
