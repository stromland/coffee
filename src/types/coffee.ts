export interface CoffeeSettings {
  coffeeAmount: number;
  waterRatio: number;
  totalWater: number;
}

export interface BrewStep {
  stepNumber: number;
  waterAmount: number;
  cumulativeWater: number;
  timeSeconds: number;
  description: string;
}

export interface BrewMethod {
  id: string;
  name: string;
  description: string;
  creditName?: string;
  creditUrl?: string;
  drawdownTime?: number; // Default drawdown time in seconds after last pour
  generateSteps: (totalWater: number, presetId?: string) => BrewStep[];
}

export interface FourSixPour {
  amount: number; // in grams (based on 300g total)
  timeSeconds: number;
}

export interface FourSixPreset {
  id: string;
  name: string;
  pours: FourSixPour[];
  isDefault: boolean;
  drawdownTime: number; // Additional time in seconds after last pour for coffee to drip through
}

export interface CustomRecipePour {
  percentage: number; // percentage of total water (0-100)
  timeSeconds: number;
  description?: string; // Optional custom description for the pour
}

export interface CustomRecipePreset {
  id: string;
  name: string;
  pours: CustomRecipePour[];
  drawdownTime: number; // Additional time in seconds after last pour for coffee to drip through
}

export interface BrewingSession {
  id: string;
  timestamp: number; // Unix timestamp in milliseconds
  coffeeType: string; // Name or type of coffee beans
  brewingMethod: string; // Method ID (e.g., '4-6', 'hoffman')
  brewingPreset?: string; // Preset ID for 4:6 method
  coffeeAmount: number; // Amount in grams
  waterAmount: number; // Amount in ml/g
  waterTemperature?: number; // Temperature in celsius
  brewTime?: number; // Duration in seconds
  grindSize?: string; // Grind size description
  rating?: number; // 1-5 scale
  notes?: string; // Tasting notes or observations
}
