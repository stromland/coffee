import type { BrewMethod, BrewStep } from '../../types/coffee';
import { brewMethodService } from './BrewMethodService';

/**
 * Brewing calculations service
 * Consolidates logic from coffeeCalculations.ts
 */
export class BrewingService {
  /**
   * Calculate total water needed based on coffee amount and ratio
   */
  calculateTotalWater(coffeeAmount: number, ratio: number): number {
    return coffeeAmount * ratio;
  }

  /**
   * Generate brew steps for a specific method
   */
  generateBrewSteps(methodId: string, totalWater: number): BrewStep[] {
    return brewMethodService.generateSteps(methodId, totalWater);
  }

  /**
   * Get a brew method by ID
   */
  getBrewMethod(id: string): BrewMethod | undefined {
    return brewMethodService.getMethodById(id);
  }

  /**
   * Get all available brew methods
   */
  getAllBrewMethods(): BrewMethod[] {
    return brewMethodService.getAllMethods();
  }

  /**
   * Get the drawdown time for a method
   */
  getDrawdownTime(methodId: string): number {
    const method = this.getBrewMethod(methodId);
    return method?.drawdownTime || 60;
  }

  /**
   * Calculate total brew time (last pour + drawdown)
   */
  calculateTotalBrewTime(methodId: string): number {
    return brewMethodService.calculateTotalBrewTime(methodId);
  }
}

/**
 * Singleton instance of BrewingService
 */
export const brewingService = new BrewingService();
