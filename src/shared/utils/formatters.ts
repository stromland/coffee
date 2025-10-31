/**
 * Common formatting utilities for the application
 */

/**
 * Format a timestamp to a readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g., "Jan 1, 2024, 10:30 AM")
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format seconds to MM:SS format
 * @param seconds - Total seconds
 * @returns Formatted time string (e.g., "03:45")
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format a number to a fixed decimal places
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

/**
 * Format weight in grams with unit
 * @param grams - Weight in grams
 * @returns Formatted weight string (e.g., "15.5g")
 */
export const formatWeight = (grams: number): string => {
  return `${formatNumber(grams)}g`;
};

/**
 * Format ratio (e.g., 1:15 coffee to water ratio)
 * @param ratio - Numeric ratio value
 * @returns Formatted ratio string (e.g., "1:15")
 */
export const formatRatio = (ratio: number): string => {
  return `1:${formatNumber(ratio, 0)}`;
};
