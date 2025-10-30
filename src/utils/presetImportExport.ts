import type { FourSixPreset } from '../types/coffee';
import { savePreset, loadPresets } from './presetStorage';

interface ExportData {
  version: string;
  type: 'foursix-presets';
  presets: FourSixPreset[];
  exportDate: string;
}

/**
 * Export a single 4:6 preset as JSON
 */
export const exportFourSixPreset = (preset: FourSixPreset): void => {
  const data: ExportData = {
    version: '1.0',
    type: 'foursix-presets',
    presets: [preset],
    exportDate: new Date().toISOString(),
  };
  
  downloadJSON(data, `${sanitizeFilename(preset.name)}-preset.json`);
};

/**
 * Export all custom 4:6 presets as JSON
 */
export const exportAllFourSixPresets = (): void => {
  const presets = loadPresets().filter(p => !p.isDefault);
  
  if (presets.length === 0) {
    throw new Error('No custom presets to export');
  }
  
  const data: ExportData = {
    version: '1.0',
    type: 'foursix-presets',
    presets,
    exportDate: new Date().toISOString(),
  };
  
  downloadJSON(data, 'foursix-presets-backup.json');
};

/**
 * Validate and import 4:6 presets from JSON
 */
export const importFourSixPresets = (file: File): Promise<{ imported: number; skipped: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ExportData;
        
        // Validate the data structure
        if (!validateFourSixExportData(data)) {
          reject(new Error('Invalid preset file format'));
          return;
        }
        
        const existingPresets = loadPresets();
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
          
          // Ensure it's not marked as default
          preset.isDefault = false;
          
          // Validate preset structure
          if (validateFourSixPreset(preset)) {
            savePreset(preset);
            imported++;
          } else {
            skipped++;
          }
        }
        
        resolve({ imported, skipped });
      } catch (error) {
        reject(new Error('Failed to parse preset file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validate the structure of exported 4:6 preset data
 */
const validateFourSixExportData = (data: unknown): data is ExportData => {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Partial<ExportData>;
  
  return (
    typeof d.version === 'string' &&
    d.type === 'foursix-presets' &&
    Array.isArray(d.presets) &&
    d.presets.every(validateFourSixPreset)
  );
};

/**
 * Validate a single 4:6 preset
 */
const validateFourSixPreset = (preset: unknown): preset is FourSixPreset => {
  if (!preset || typeof preset !== 'object') return false;
  
  const p = preset as Partial<FourSixPreset>;
  
  // If totalBrewTime is missing, add a default value for backwards compatibility
  if (typeof p.totalBrewTime !== 'number') {
    (p as FourSixPreset).totalBrewTime = 210; // Default to 3:30
  }
  
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    Array.isArray(p.pours) &&
    p.pours.length > 0 &&
    p.pours.every(pour => 
      typeof pour === 'object' &&
      typeof pour.amount === 'number' &&
      typeof pour.timeSeconds === 'number' &&
      pour.amount > 0 &&
      pour.timeSeconds >= 0
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
