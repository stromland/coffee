import type { FourSixPreset, CustomRecipePreset } from '../../types/coffee';
import { presetService } from './PresetService';

/**
 * Export data structure for FourSix presets
 */
interface FourSixExportData {
  version: string;
  type: 'foursix-presets';
  presets: FourSixPreset[];
  exportDate: string;
}

/**
 * Export data structure for Custom Recipe presets
 */
interface CustomRecipeExportData {
  version: string;
  type: 'custom-recipe-presets';
  presets: CustomRecipePreset[];
  exportDate: string;
}

/**
 * Import/Export result
 */
export interface ImportResult {
  imported: number;
  skipped: number;
}

/**
 * Unified import/export service
 * Merges logic from presetImportExport.ts and customRecipeImportExport.ts
 */
export class ImportExportService {
  // ===== FourSix Preset Export/Import =====

  /**
   * Export a single FourSix preset as JSON
   */
  exportFourSixPreset(preset: FourSixPreset): void {
    const data: FourSixExportData = {
      version: '1.0',
      type: 'foursix-presets',
      presets: [preset],
      exportDate: new Date().toISOString(),
    };
    
    this.downloadJSON(data, `${this.sanitizeFilename(preset.name)}-preset.json`);
  }

  /**
   * Export all custom FourSix presets as JSON
   */
  exportAllFourSixPresets(): void {
    const presets = presetService.loadFourSixPresets().filter(p => !p.isDefault);
    
    if (presets.length === 0) {
      throw new Error('No custom presets to export');
    }
    
    const data: FourSixExportData = {
      version: '1.0',
      type: 'foursix-presets',
      presets,
      exportDate: new Date().toISOString(),
    };
    
    this.downloadJSON(data, 'foursix-presets-backup.json');
  }

  /**
   * Import FourSix presets from a file
   */
  importFourSixPresets(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as FourSixExportData;
          
          if (!this.validateFourSixExportData(data)) {
            reject(new Error('Invalid preset file format'));
            return;
          }
          
          const existingPresets = presetService.loadFourSixPresets();
          let imported = 0;
          let skipped = 0;
          
          for (const preset of data.presets) {
            const existingPreset = existingPresets.find(p => p.id === preset.id);
            
            if (existingPreset) {
              // Generate a new ID for the imported preset
              preset.id = this.generateImportedId(preset.id);
              preset.name = `${preset.name} (imported)`;
            }
            
            preset.isDefault = false;
            
            if (this.validateFourSixPreset(preset)) {
              presetService.saveFourSixPreset(preset);
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
  }

  // ===== Custom Recipe Preset Export/Import =====

  /**
   * Export a single custom recipe preset as JSON
   */
  exportCustomRecipePreset(preset: CustomRecipePreset): void {
    const data: CustomRecipeExportData = {
      version: '1.0',
      type: 'custom-recipe-presets',
      presets: [preset],
      exportDate: new Date().toISOString(),
    };
    
    this.downloadJSON(data, `${this.sanitizeFilename(preset.name)}-recipe.json`);
  }

  /**
   * Export all custom recipe presets as JSON
   */
  exportAllCustomRecipePresets(): void {
    const presets = presetService.loadCustomRecipePresets();
    
    if (presets.length === 0) {
      throw new Error('No custom recipes to export');
    }
    
    const data: CustomRecipeExportData = {
      version: '1.0',
      type: 'custom-recipe-presets',
      presets,
      exportDate: new Date().toISOString(),
    };
    
    this.downloadJSON(data, 'custom-recipes-backup.json');
  }

  /**
   * Import custom recipe presets from a file
   */
  importCustomRecipePresets(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as CustomRecipeExportData;
          
          if (!this.validateCustomRecipeExportData(data)) {
            reject(new Error('Invalid recipe file format'));
            return;
          }
          
          const existingPresets = presetService.loadCustomRecipePresets();
          let imported = 0;
          let skipped = 0;
          
          for (const preset of data.presets) {
            const existingPreset = existingPresets.find(p => p.id === preset.id);
            
            if (existingPreset) {
              // Generate a new ID for the imported preset
              preset.id = this.generateImportedId(preset.id);
              preset.name = `${preset.name} (imported)`;
            }
            
            if (this.validateCustomRecipePreset(preset)) {
              presetService.saveCustomRecipePreset(preset);
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
  }

  // ===== Private: Validation Methods =====

  private validateFourSixExportData(data: unknown): data is FourSixExportData {
    if (!data || typeof data !== 'object') return false;
    
    const d = data as Partial<FourSixExportData>;
    
    return (
      typeof d.version === 'string' &&
      d.type === 'foursix-presets' &&
      Array.isArray(d.presets) &&
      d.presets.every(p => this.validateFourSixPreset(p))
    );
  }

  private validateFourSixPreset(preset: unknown): preset is FourSixPreset {
    if (!preset || typeof preset !== 'object') return false;
    
    const p = preset as Partial<FourSixPreset>;
    
    return (
      typeof p.id === 'string' &&
      typeof p.name === 'string' &&
      typeof p.drawdownTime === 'number' &&
      p.drawdownTime >= 0 &&
      Array.isArray(p.pours) &&
      p.pours.length > 0 &&
      p.pours.every(pour => 
        pour && typeof pour === 'object' &&
        typeof pour.amount === 'number' &&
        typeof pour.timeSeconds === 'number' &&
        pour.amount > 0 &&
        pour.timeSeconds >= 0
      )
    );
  }

  private validateCustomRecipeExportData(data: unknown): data is CustomRecipeExportData {
    if (!data || typeof data !== 'object') return false;
    
    const d = data as Partial<CustomRecipeExportData>;
    
    return (
      typeof d.version === 'string' &&
      d.type === 'custom-recipe-presets' &&
      Array.isArray(d.presets) &&
      d.presets.every(p => this.validateCustomRecipePreset(p))
    );
  }

  private validateCustomRecipePreset(preset: unknown): preset is CustomRecipePreset {
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
        pour && typeof pour === 'object' &&
        typeof pour.percentage === 'number' &&
        typeof pour.timeSeconds === 'number' &&
        pour.percentage >= 0 &&
        pour.percentage <= 100 &&
        pour.timeSeconds >= 0 &&
        (pour.description === undefined || typeof pour.description === 'string')
      )
    );
  }

  // ===== Private: Utility Methods =====

  /**
   * Generate a unique ID for imported presets
   */
  private generateImportedId(originalId: string): string {
    return `${originalId}-imported-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  }

  private downloadJSON(data: unknown, filename: string): void {
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
  }
}

/**
 * Singleton instance of ImportExportService
 */
export const importExportService = new ImportExportService();
