import type { FourSixPreset } from '../types/coffee';

const STORAGE_KEY = 'coffee-brew-46-presets';

export const defaultPresets: FourSixPreset[] = [
  {
    id: 'default-46',
    name: 'Original 4:6',
    isDefault: true,
    pours: [
      { amount: 50, timeSeconds: 0 },
      { amount: 70, timeSeconds: 45 },
      { amount: 90, timeSeconds: 90 },
      { amount: 90, timeSeconds: 135 },
    ],
  },
  {
    id: 'gentle-46',
    name: 'Gentle (5 pours)',
    isDefault: true,
    pours: [
      { amount: 60, timeSeconds: 0 },
      { amount: 60, timeSeconds: 45 },
      { amount: 60, timeSeconds: 90 },
      { amount: 60, timeSeconds: 120 },
      { amount: 60, timeSeconds: 150 },
    ],
  },
  {
    id: 'bold-46',
    name: 'Bold (3 pours)',
    isDefault: true,
    pours: [
      { amount: 120, timeSeconds: 0 },
      { amount: 90, timeSeconds: 60 },
      { amount: 90, timeSeconds: 120 },
    ],
  },
];

export const loadPresets = (): FourSixPreset[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultPresets;
    }
    const customPresets = JSON.parse(stored) as FourSixPreset[];
    return [...defaultPresets, ...customPresets];
  } catch (error) {
    console.error('Failed to load presets:', error);
    return defaultPresets;
  }
};

export const savePreset = (preset: FourSixPreset): void => {
  try {
    const customPresets = loadPresets().filter(p => !p.isDefault);
    customPresets.push(preset);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
  } catch (error) {
    console.error('Failed to save preset:', error);
    throw new Error('Failed to save preset');
  }
};

export const deletePreset = (presetId: string): void => {
  try {
    const customPresets = loadPresets().filter(p => !p.isDefault && p.id !== presetId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
  } catch (error) {
    console.error('Failed to delete preset:', error);
    throw new Error('Failed to delete preset');
  }
};

export const getPresetById = (presetId: string): FourSixPreset | undefined => {
  return loadPresets().find(p => p.id === presetId);
};
