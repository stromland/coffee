import { useState } from 'react';
import { importExportService, type ImportResult } from '../../core/services';
import type { FourSixPreset, CustomRecipePreset } from '../../types/coffee';

/**
 * Hook for preset import/export operations
 * Provides a unified interface for importing and exporting both FourSix and Custom Recipe presets
 */
export const usePresetImportExport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // ===== FourSix Preset Methods =====

  const exportFourSixPreset = (preset: FourSixPreset) => {
    try {
      importExportService.exportFourSixPreset(preset);
    } catch (error) {
      console.error('Failed to export FourSix preset:', error);
      throw error;
    }
  };

  const exportAllFourSixPresets = () => {
    try {
      importExportService.exportAllFourSixPresets();
    } catch (error) {
      console.error('Failed to export all FourSix presets:', error);
      throw error;
    }
  };

  const importFourSixPresets = async (file: File): Promise<ImportResult> => {
    setIsImporting(true);
    setImportError(null);
    
    try {
      const result = await importExportService.importFourSixPresets(file);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import presets';
      setImportError(errorMessage);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  // ===== Custom Recipe Preset Methods =====

  const exportCustomRecipePreset = (preset: CustomRecipePreset) => {
    try {
      importExportService.exportCustomRecipePreset(preset);
    } catch (error) {
      console.error('Failed to export custom recipe preset:', error);
      throw error;
    }
  };

  const exportAllCustomRecipePresets = () => {
    try {
      importExportService.exportAllCustomRecipePresets();
    } catch (error) {
      console.error('Failed to export all custom recipe presets:', error);
      throw error;
    }
  };

  const importCustomRecipePresets = async (file: File): Promise<ImportResult> => {
    setIsImporting(true);
    setImportError(null);
    
    try {
      const result = await importExportService.importCustomRecipePresets(file);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import recipes';
      setImportError(errorMessage);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    // State
    isImporting,
    importError,
    
    // FourSix methods
    exportFourSixPreset,
    exportAllFourSixPresets,
    importFourSixPresets,
    
    // Custom Recipe methods
    exportCustomRecipePreset,
    exportAllCustomRecipePresets,
    importCustomRecipePresets,
  };
};
