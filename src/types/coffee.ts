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
  totalBrewTime: number; // in seconds
  generateSteps: (totalWater: number) => BrewStep[];
}
