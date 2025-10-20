import type { BrewMethod, BrewStep } from "../types/coffee";
import { getPresetById, defaultPresets } from "./presetStorage";

export const calculateTotalWater = (
  coffeeAmount: number,
  ratio: number
): number => {
  return coffeeAmount * ratio;
};

// 4:6 Method by Tetsu Kasuya
// Custom pour pattern: 50g, 70g, 90g, 90g (for 300g total)
// Scales proportionally: 16.67%, 23.33%, 30%, 30%
const generate46Steps = (totalWater: number, presetId?: string): BrewStep[] => {
  const BASE_WATER = 300;
  const preset = presetId ? getPresetById(presetId) : defaultPresets[0];
  
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
        description: "First pour (40% phase - affects sweetness)",
      },
      {
        stepNumber: 2,
        waterAmount: pour2,
        cumulativeWater: pour1 + pour2,
        timeSeconds: 45,
        description: "Second pour (40% phase - affects sweetness)",
      },
      {
        stepNumber: 3,
        waterAmount: pour3,
        cumulativeWater: pour1 + pour2 + pour3,
        timeSeconds: 90,
        description: "Third pour (60% phase - affects strength)",
      },
      {
        stepNumber: 4,
        waterAmount: pour4,
        cumulativeWater: totalWater,
        timeSeconds: 135,
        description: "Fourth pour (60% phase - affects strength)",
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
    const phase = isPhase1 ? "40% phase - affects sweetness" : "60% phase - affects strength";
    
    return {
      stepNumber: index + 1,
      waterAmount: scaledAmount,
      cumulativeWater,
      timeSeconds: pour.timeSeconds,
      description: `Pour ${index + 1} (${phase})`,
    };
  });
};

// Hoffman Method - 1 Cup V60 Method
// Based on James Hoffmann's recipe: 15g coffee, 250g water
// Bloom (20% total) + 4 progressive pours to reach 40%, 60%, 80%, 100%
const generateHoffmanSteps = (totalWater: number): BrewStep[] => {
  const bloom = totalWater * 0.2; // 20% bloom (50g for 250g total)
  const pour2 = totalWater * 0.2; // Pour to 40% total (50g more)
  const pour3 = totalWater * 0.2; // Pour to 60% total (50g more)
  const pour4 = totalWater * 0.2; // Pour to 80% total (50g more)
  const pour5 = totalWater * 0.2; // Pour to 100% total (50g more)

  return [
    {
      stepNumber: 1,
      waterAmount: bloom,
      cumulativeWater: bloom,
      timeSeconds: 0,
      description: "Bloom - swirl gently at 10-15s",
    },
    {
      stepNumber: 2,
      waterAmount: pour2,
      cumulativeWater: bloom + pour2,
      timeSeconds: 45,
      description: "Pour to 40% total",
    },
    {
      stepNumber: 3,
      waterAmount: pour3,
      cumulativeWater: bloom + pour2 + pour3,
      timeSeconds: 70,
      description: "Pour to 60% total",
    },
    {
      stepNumber: 4,
      waterAmount: pour4,
      cumulativeWater: bloom + pour2 + pour3 + pour4,
      timeSeconds: 90,
      description: "Pour to 80% total",
    },
    {
      stepNumber: 5,
      waterAmount: pour5,
      cumulativeWater: totalWater,
      timeSeconds: 110,
      description: "Pour to 100% total - swirl at 2:00",
    },
  ];
};

// Single continuous pour
const generateSinglePourSteps = (totalWater: number): BrewStep[] => {
  return [
    {
      stepNumber: 1,
      waterAmount: totalWater,
      cumulativeWater: totalWater,
      timeSeconds: 0,
      description: "Pour all water in a slow, continuous stream",
    },
  ];
};

export const brewMethods: BrewMethod[] = [
  {
    id: "4-6",
    name: "4:6 Method",
    description: "Tetsu Kasuya's 4:6 method - 4 pours with progressive volumes",
    creditName: "Tetsu Kasuya (2016 World Brewers Cup Champion)",
    creditUrl: "https://projectbarista.com/4-6-method-recipe/",
    totalBrewTime: 210, // 3:30 minutes
    generateSteps: generate46Steps,
  },
  {
    id: "hoffman",
    name: "Hoffman Method",
    description: "James Hoffmann's 1 Cup V60 method - 5 equal pours (20% each)",
    creditName: "James Hoffmann",
    creditUrl: "https://www.youtube.com/watch?v=1oB1oDrDkHM",
    totalBrewTime: 180, // 3:00 minutes (drawdown complete)
    generateSteps: generateHoffmanSteps,
  },
  {
    id: "single-pour",
    name: "Single Pour",
    description: "Simple continuous pour method",
    totalBrewTime: 180, // 3:00 minutes
    generateSteps: generateSinglePourSteps,
  },
];

export const getBrewMethod = (id: string): BrewMethod | undefined => {
  return brewMethods.find((method) => method.id === id);
};
