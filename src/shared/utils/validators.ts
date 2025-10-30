/**
 * Common validation utilities for the application
 */

/**
 * Validate that a number is within a range
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate that a string is not empty
 * @param value - String to validate
 * @returns True if string is not empty after trimming
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate that a number is positive
 * @param value - Number to validate
 * @returns True if value is positive (> 0)
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * Validate that a number is non-negative
 * @param value - Number to validate
 * @returns True if value is >= 0
 */
export const isNonNegative = (value: number): boolean => {
  return value >= 0;
};

/**
 * Parse a numeric string and return a number or default value
 * @param value - String to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed number or default value
 */
export const parseNumber = (value: string, defaultValue: number = 0): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Parse an integer string and return an integer or default value
 * @param value - String to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed integer or default value
 */
export const parseInteger = (value: string, defaultValue: number = 0): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};
