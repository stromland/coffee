import type { BrewMethod, BrewStep } from '../../types/coffee';
import { presetService } from './PresetService';

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
  generateBrewSteps(
    methodId: string,
    totalWater: number,
    presetId?: string
  ): BrewStep[] {
    const method = this.getBrewMethod(methodId);
    if (!method) {
      throw new Error(`Brew method not found: ${methodId}`);
    }

    return method.generateSteps(totalWater, presetId);
  }

  /**
   * Get a brew method by ID
   */
  getBrewMethod(id: string): BrewMethod | undefined {
    return this.brewMethods.find(method => method.id === id);
  }

  /**
   * Get all available brew methods
   */
  getAllBrewMethods(): BrewMethod[] {
    return this.brewMethods;
  }

  /**
   * Get the drawdown time for a method/preset combination
   */
  getDrawdownTime(methodId: string, presetId?: string): number {
    if (methodId === '4-6' && presetId) {
      const preset = presetService.getFourSixPresetById(presetId);
      if (preset) {
        return preset.drawdownTime;
      }
    } else if (methodId === 'custom-recipe' && presetId) {
      const preset = presetService.getCustomRecipePresetById(presetId);
      if (preset) {
        return preset.drawdownTime;
      }
    }

    const method = this.getBrewMethod(methodId);
    return method?.drawdownTime || 60;
  }

  // ===== Private: Brew Method Definitions =====

  private brewMethods: BrewMethod[] = [
    {
      id: '4-6',
      name: '4:6 Method',
      description: "Tetsu Kasuya's 4:6 method",
      creditName: 'Tetsu Kasuya (2016 World Brewers Cup Champion)',
      creditUrl: 'https://projectbarista.com/4-6-method-recipe/',
      drawdownTime: 75,
      generateSteps: this.generate46Steps.bind(this),
    },
    {
      id: 'hoffman',
      name: 'Hoffman Method',
      description: "James Hoffmann's 1 Cup V60 method",
      creditName: 'James Hoffmann',
      creditUrl: 'https://www.youtube.com/watch?v=1oB1oDrDkHM',
      drawdownTime: 70,
      generateSteps: this.generateHoffmanSteps.bind(this),
    },
    {
      id: 'single-pour',
      name: 'Single Pour',
      description: 'Simple continuous pour method',
      drawdownTime: 120,
      generateSteps: this.generateSinglePourSteps.bind(this),
    },
    {
      id: 'custom-recipe',
      name: 'Custom Recipe',
      description: 'Create your own brewing recipe with custom pours',
      drawdownTime: 60,
      generateSteps: this.generateCustomSteps.bind(this),
    },
  ];

  // ===== Private: Step Generation Methods =====

  private generate46Steps(totalWater: number, presetId?: string): BrewStep[] {
    const BASE_WATER = 300;
    const preset = presetId ? presetService.getFourSixPresetById(presetId) : undefined;
    
    if (!preset) {
      // Fallback to original pattern
      const pour1 = totalWater * 0.1667;
      const pour2 = totalWater * 0.2333;
      const pour3 = totalWater * 0.3;
      const pour4 = totalWater * 0.3;

      return [
        {
          stepNumber: 1,
          waterAmount: pour1,
          cumulativeWater: pour1,
          timeSeconds: 0,
          description: '40% phase - affects sweetness',
        },
        {
          stepNumber: 2,
          waterAmount: pour2,
          cumulativeWater: pour1 + pour2,
          timeSeconds: 45,
          description: '40% phase - affects sweetness',
        },
        {
          stepNumber: 3,
          waterAmount: pour3,
          cumulativeWater: pour1 + pour2 + pour3,
          timeSeconds: 90,
          description: '60% phase - affects strength',
        },
        {
          stepNumber: 4,
          waterAmount: pour4,
          cumulativeWater: totalWater,
          timeSeconds: 135,
          description: '60% phase - affects strength',
        },
      ];
    }

    // Scale preset from 300g to actual totalWater
    const scale = totalWater / BASE_WATER;
    let cumulativeWater = 0;
    
    // Determine phase split (40% for phase 1)
    const phase1Target = BASE_WATER * 0.4;
    let phase1Index = -1;
    let cumulative = 0;
    
    for (let i = 0; i < preset.pours.length; i++) {
      cumulative += preset.pours[i].amount;
      if (cumulative >= phase1Target - 0.1 && phase1Index === -1) {
        phase1Index = i;
        break;
      }
    }

    return preset.pours.map((pour, index) => {
      const scaledAmount = pour.amount * scale;
      cumulativeWater += scaledAmount;
      
      const isPhase1 = index <= phase1Index;
      const phase = isPhase1 ? '40% phase - affects sweetness' : '60% phase - affects strength';
      
      return {
        stepNumber: index + 1,
        waterAmount: scaledAmount,
        cumulativeWater,
        timeSeconds: pour.timeSeconds,
        description: phase,
      };
    });
  }

  private generateHoffmanSteps(totalWater: number): BrewStep[] {
    const bloom = totalWater * 0.2;
    const pour2 = totalWater * 0.2;
    const pour3 = totalWater * 0.2;
    const pour4 = totalWater * 0.2;
    const pour5 = totalWater * 0.2;

    return [
      {
        stepNumber: 1,
        waterAmount: bloom,
        cumulativeWater: bloom,
        timeSeconds: 0,
        description: 'Bloom - swirl gently at 10-15s',
      },
      {
        stepNumber: 2,
        waterAmount: pour2,
        cumulativeWater: bloom + pour2,
        timeSeconds: 45,
        description: 'Continue pouring',
      },
      {
        stepNumber: 3,
        waterAmount: pour3,
        cumulativeWater: bloom + pour2 + pour3,
        timeSeconds: 70,
        description: 'Continue pouring',
      },
      {
        stepNumber: 4,
        waterAmount: pour4,
        cumulativeWater: bloom + pour2 + pour3 + pour4,
        timeSeconds: 90,
        description: 'Continue pouring',
      },
      {
        stepNumber: 5,
        waterAmount: pour5,
        cumulativeWater: totalWater,
        timeSeconds: 110,
        description: 'Final pour - swirl at 2:00',
      },
    ];
  }

  private generateSinglePourSteps(totalWater: number): BrewStep[] {
    return [
      {
        stepNumber: 1,
        waterAmount: totalWater,
        cumulativeWater: totalWater,
        timeSeconds: 0,
        description: 'Pour all water in a slow, continuous stream',
      },
    ];
  }

  private generateCustomSteps(totalWater: number, presetId?: string): BrewStep[] {
    if (!presetId) {
      return [
        {
          stepNumber: 1,
          waterAmount: totalWater,
          cumulativeWater: totalWater,
          timeSeconds: 0,
          description: 'Create a custom preset to define your brew steps',
        },
      ];
    }

    const preset = presetService.getCustomRecipePresetById(presetId);
    if (!preset) {
      return [
        {
          stepNumber: 1,
          waterAmount: totalWater,
          cumulativeWater: totalWater,
          timeSeconds: 0,
          description: 'Preset not found',
        },
      ];
    }

    let cumulativeWater = 0;
    return preset.pours.map((pour, index) => {
      const waterAmount = (pour.percentage / 100) * totalWater;
      cumulativeWater += waterAmount;
      
      return {
        stepNumber: index + 1,
        waterAmount,
        cumulativeWater,
        timeSeconds: pour.timeSeconds,
        description: pour.description || `Pour ${index + 1}`,
      };
    });
  }
}

/**
 * Singleton instance of BrewingService
 */
export const brewingService = new BrewingService();
