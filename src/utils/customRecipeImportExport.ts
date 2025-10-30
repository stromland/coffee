import type { CustomRecipePreset } from '../types/coffee';
import { saveCustomPreset, loadCustomPresets } from './customRecipeStorage';

interface ExportData {
  version: string;
  type: 'custom-recipe-presets';
  presets: CustomRecipePreset[];
  exportDate: string;
}

/**
 * Export a single custom recipe preset as JSON
 */
export const exportCustomRecipePreset = (preset: CustomRecipePreset): void => {
  const data: ExportData = {
    version: '1.0',
    type: 'custom-recipe-presets',
    presets: [preset],
    exportDate: new Date().toISOString(),
  };
  
  downloadJSON(data, `${sanitizeFilename(preset.name)}-recipe.json`);
};

/**
 * Export all custom recipe presets as JSON
 */
export const exportAllCustomRecipePresets = (): void => {
  const presets = loadCustomPresets();
  
  if (presets.length === 0) {
    throw new Error('No custom recipes to export');
  }
  
  const data: ExportData = {
    version: '1.0',
    type: 'custom-recipe-presets',
    presets,
    exportDate: new Date().toISOString(),
  };
  
  downloadJSON(data, 'custom-recipes-backup.json');
};

/**
 * Validate and import custom recipe presets from JSON
 */
export const importCustomRecipePresets = (file: File): Promise<{ imported: number; skipped: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ExportData;
        
        // Validate the data structure
        if (!validateCustomRecipeExportData(data)) {
          reject(new Error('Invalid recipe file format'));
          return;
        }
        
        const existingPresets = loadCustomPresets();
        let imported = 0;
        let skipped = 0;
        
        for (const preset of data.presets) {
          // Check for ID conflicts
          const existingPreset = existingPresets.find(p => p.id === preset.id);
          
          if (existingPreset) {
            // Generate a new ID for the imported preset
            preset.id = `${preset.id}-imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            preset.name = `${preset.name} (imported)`;
          }
          
          // Validate preset structure
          if (validateCustomRecipePreset(preset)) {
            saveCustomPreset(preset);
            imported++;
          } else {
            skipped++;
          }
        }
        
        resolve({ imported, skipped });
      } catch (error) {
        reject(new Error('Failed to parse recipe file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validate the structure of exported custom recipe preset data
 */
const validateCustomRecipeExportData = (data: unknown): data is ExportData => {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Partial<ExportData>;
  
  return (
    typeof d.version === 'string' &&
    d.type === 'custom-recipe-presets' &&
    Array.isArray(d.presets) &&
    d.presets.every(validateCustomRecipePreset)
  );
};

/**
 * Validate a single custom recipe preset
 */
const validateCustomRecipePreset = (preset: unknown): preset is CustomRecipePreset => {
  if (!preset || typeof preset !== 'object') return false;
  
  const p = preset as Partial<CustomRecipePreset>;
  
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.drawdownTime === 'number' &&
    p.drawdownTime >= 0 &&
    Array.isArray(p.pours) &&
    p.pours.length > 0 &&
    p.pours.every(pour => 
      typeof pour === 'object' &&
      typeof pour.percentage === 'number' &&
      typeof pour.timeSeconds === 'number' &&
      pour.percentage >= 0 &&
      pour.percentage <= 100 &&
      pour.timeSeconds >= 0 &&
      (pour.description === undefined || typeof pour.description === 'string')
    )
  );
};

/**
 * Sanitize a filename by removing invalid characters
 */
const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
};

/**
 * Download data as a JSON file
 */
const downloadJSON = (data: unknown, filename: string): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
