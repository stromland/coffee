/**
 * Common mathematical utilities for the application
 */

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Round a number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export const roundTo = (value: number, decimals: number): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Calculate percentage of a value
 * @param value - Value to calculate percentage from
 * @param percentage - Percentage (0-100)
 * @returns Calculated percentage value
 */
export const percentageOf = (value: number, percentage: number): number => {
  return (value * percentage) / 100;
};

/**
 * Convert a value to percentage
 * @param part - Part value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export const toPercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

/**
 * Sum an array of numbers
 * @param values - Array of numbers to sum
 * @returns Sum of all values
 */
export const sum = (values: number[]): number => {
  return values.reduce((acc, val) => acc + val, 0);
};
