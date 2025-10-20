import type { FourSixPour } from '../types/coffee';

const BASE_WATER = 300; // Base water amount for presets
const PHASE_1_PERCENT = 0.4; // 40% for sweetness
const PHASE_2_PERCENT = 0.6; // 60% for strength

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  phase1Total: number;
  phase2Total: number;
  phase1Percentage: number;
  phase2Percentage: number;
}

export const validateFourSixPreset = (pours: FourSixPour[]): ValidationResult => {
  const errors: string[] = [];
  
  if (pours.length === 0) {
    errors.push('At least one pour is required');
    return {
      isValid: false,
      errors,
      phase1Total: 0,
      phase2Total: 0,
      phase1Percentage: 0,
      phase2Percentage: 0,
    };
  }

  const total = pours.reduce((sum, pour) => sum + pour.amount, 0);
  
  if (Math.abs(total - BASE_WATER) > 0.1) {
    errors.push(`Total water must be ${BASE_WATER}g (current: ${total.toFixed(1)}g)`);
  }

  // Find where phase 1 (40%) ends
  let cumulative = 0;
  let phase1End = 0;
  const phase1Target = BASE_WATER * PHASE_1_PERCENT;
  
  for (let i = 0; i < pours.length; i++) {
    cumulative += pours[i].amount;
    if (cumulative >= phase1Target - 0.1) {
      phase1End = i;
      break;
    }
  }

  const phase1Total = pours.slice(0, phase1End + 1).reduce((sum, pour) => sum + pour.amount, 0);
  const phase2Total = pours.slice(phase1End + 1).reduce((sum, pour) => sum + pour.amount, 0);

  const phase1Percentage = (phase1Total / BASE_WATER) * 100;
  const phase2Percentage = (phase2Total / BASE_WATER) * 100;

  // Validate phase 1 is exactly 40% (within tolerance)
  if (Math.abs(phase1Total - phase1Target) > 0.1) {
    errors.push(`Phase 1 (sweetness) must be exactly 40% (${phase1Target}g). Current: ${phase1Total.toFixed(1)}g (${phase1Percentage.toFixed(1)}%)`);
  }

  // Validate phase 2 is exactly 60%
  const phase2Target = BASE_WATER * PHASE_2_PERCENT;
  if (Math.abs(phase2Total - phase2Target) > 0.1) {
    errors.push(`Phase 2 (strength) must be exactly 60% (${phase2Target}g). Current: ${phase2Total.toFixed(1)}g (${phase2Percentage.toFixed(1)}%)`);
  }

  // Validate pour amounts are positive
  pours.forEach((pour, index) => {
    if (pour.amount <= 0) {
      errors.push(`Pour ${index + 1} amount must be greater than 0`);
    }
  });

  // Validate timing
  for (let i = 1; i < pours.length; i++) {
    if (pours[i].timeSeconds <= pours[i - 1].timeSeconds) {
      errors.push(`Pour ${i + 1} time must be after pour ${i} time`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    phase1Total,
    phase2Total,
    phase1Percentage,
    phase2Percentage,
  };
};
