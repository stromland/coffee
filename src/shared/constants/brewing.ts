/**
 * Brewing-related constants
 */

/**
 * Base water amount (in grams) used for preset calculations
 * The 4:6 method and other presets are based on 300g of water
 */
export const BASE_WATER_AMOUNT = 300;

/**
 * Default coffee to water ratios
 */
export const DEFAULT_RATIOS = {
  /** Light roast recommended ratio (1:16) */
  LIGHT: 16,
  /** Medium roast recommended ratio (1:15) */
  MEDIUM: 15,
  /** Dark roast recommended ratio (1:14) */
  DARK: 14,
} as const;

/**
 * 4:6 Method phase split
 * Phase 1 affects sweetness (40% of total water)
 * Phase 2 affects strength (60% of total water)
 */
export const FOUR_SIX_PHASE_SPLIT = {
  PHASE_1: 0.4,
  PHASE_2: 0.6,
} as const;

/**
 * Default drawdown times (in seconds) for different brew methods
 */
export const DEFAULT_DRAWDOWN_TIMES = {
  /** 4:6 Method default drawdown */
  FOUR_SIX: 75,
  /** Hoffman Method default drawdown */
  HOFFMAN: 70,
  /** Single Pour default drawdown */
  SINGLE_POUR: 120,
  /** Custom Recipe default drawdown */
  CUSTOM: 60,
} as const;

/**
 * Time constants
 */
export const TIME_CONSTANTS = {
  /** Seconds per minute */
  SECONDS_PER_MINUTE: 60,
  /** Milliseconds per second */
  MS_PER_SECOND: 1000,
} as const;
