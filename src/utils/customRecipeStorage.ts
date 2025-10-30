import type { CustomRecipePreset } from '../types/coffee';

const STORAGE_KEY = 'coffee-custom-presets';

export const loadCustomPresets = (): CustomRecipePreset[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const presets = JSON.parse(stored) as CustomRecipePreset[];
    
    // Migration: Convert old totalBrewTime to drawdownTime
    presets.forEach(preset => {
      if ('totalBrewTime' in preset && typeof (preset as any).totalBrewTime === 'number') {
        const lastPourTime = preset.pours.length > 0 ? preset.pours[preset.pours.length - 1].timeSeconds : 0;
        preset.drawdownTime = (preset as any).totalBrewTime - lastPourTime;
        delete (preset as any).totalBrewTime;
      }
      // Default drawdown time if missing
      if (typeof preset.drawdownTime !== 'number') {
        preset.drawdownTime = 60; // Default 1 minute
      }
    });
    
    return presets;
  } catch (error) {
    console.error('Failed to load custom presets:', error);
    return [];
  }
};

export const saveCustomPreset = (preset: CustomRecipePreset): void => {
  try {
    const presets = loadCustomPresets();
    // Check if preset with same ID exists
    const existingIndex = presets.findIndex(p => p.id === preset.id);
    if (existingIndex !== -1) {
      // Update existing preset
      presets[existingIndex] = preset;
    } else {
      // Add new preset
      presets.push(preset);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save custom preset:', error);
    throw new Error('Failed to save custom preset');
  }
};

export const deleteCustomPreset = (presetId: string): void => {
  try {
    const presets = loadCustomPresets().filter(p => p.id !== presetId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to delete custom preset:', error);
    throw new Error('Failed to delete custom preset');
  }
};

export const getCustomPresetById = (presetId: string): CustomRecipePreset | undefined => {
  return loadCustomPresets().find(p => p.id === presetId);
};
