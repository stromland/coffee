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

export interface Pour {
  percentage: number; // percentage of total water (0-100)
  atTimeSeconds: number;
  description?: string; // Optional custom description for the pour
}

export interface BrewMethod {
  id: string;
  name: string;
  description: string;
  category?: string; // e.g., "4:6 Method", "James Hoffmann", "Custom"
  creditName?: string;
  creditUrl?: string;
  drawdownTime: number; // Time in seconds after last pour for coffee to drip through
  pours: Pour[];
  isDefault: boolean; // Whether this is a built-in default method
  isCustom: boolean; // Whether this was created by the user
}

export interface BrewingSession {
  id: string;
  timestamp: number; // Unix timestamp in milliseconds
  coffeeType: string; // Name or type of coffee beans
  coffeeId?: string; // Reference to selected coffee by ID
  brewingMethod: string; // Method ID (e.g., '4-6-original', 'hoffman-1cup', 'single-pour')
  coffeeAmount: number; // Amount in grams
  waterAmount: number; // Amount in ml/g
  waterTemperature?: number; // Temperature in celsius
  brewTime?: number; // Duration in seconds
  grindSize?: string; // Grind size description
  rating?: number; // 1-5 scale
  notes?: string; // Tasting notes or observations
}

export type CoffeeRoast = "light" | "medium" | "dark";
export type CoffeeType = "beans" | "ground";

export interface Coffee {
  id: string;
  brand: string;
  name: string;
  description?: string;
  roast: CoffeeRoast;
  type: CoffeeType;
  isCustom: boolean;
}
