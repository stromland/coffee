import React, { useState } from 'react';
import type { CustomRecipePreset } from '../types/coffee';
import { loadCustomPresets, deleteCustomPreset } from '../utils/customRecipeStorage';
import CustomRecipePresetEditor from './CustomRecipePresetEditor';

interface CustomRecipePresetManagerProps {
  selectedPresetId?: string;
  onPresetChange: (presetId: string) => void;
}

const CustomRecipePresetManager: React.FC<CustomRecipePresetManagerProps> = ({ 
  selectedPresetId, 
  onPresetChange 
}) => {
  const [presets, setPresets] = useState<CustomRecipePreset[]>(loadCustomPresets());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<CustomRecipePreset | undefined>();

  const handleDeletePreset = (presetId: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteCustomPreset(presetId);
      setPresets(loadCustomPresets());
      if (selectedPresetId === presetId) {
        // Deselect if the deleted preset was selected
        const remaining = loadCustomPresets();
        if (remaining.length > 0) {
          onPresetChange(remaining[0].id);
        }
      }
    }
  };

  const handleEditPreset = (preset: CustomRecipePreset) => {
    setEditingPreset(preset);
    setIsEditorOpen(true);
  };

  const handleSavePreset = () => {
    const updatedPresets = loadCustomPresets();
    setPresets(updatedPresets);
    setIsEditorOpen(false);
    setEditingPreset(undefined);
    
    // If we just created or edited a preset, select it
    if (updatedPresets.length > 0) {
      const latestPreset = editingPreset 
        ? updatedPresets.find(p => p.id === editingPreset.id)
        : updatedPresets[updatedPresets.length - 1];
      if (latestPreset) {
        onPresetChange(latestPreset.id);
      }
    }
  };

  const handleCreateNew = () => {
    setEditingPreset(undefined);
    setIsEditorOpen(true);
  };

  if (isEditorOpen) {
    return (
      <CustomRecipePresetEditor
        preset={editingPreset}
        onSave={handleSavePreset}
        onCancel={() => {
          setIsEditorOpen(false);
          setEditingPreset(undefined);
        }}
      />
    );
  }

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h3 className="text-lg font-bold text-cream">Custom Recipes</h3>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-coffee/20 hover:bg-coffee/30 border border-coffee/40 hover:border-coffee/60 text-cream rounded-md transition-all text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New
        </button>
      </div>

      {presets.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-caramel/20 rounded-lg">
          <svg className="w-12 h-12 mx-auto mb-3 text-caramel/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-caramel/70 mb-4">No custom recipes yet</p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-coffee/30 hover:bg-coffee/40 border border-coffee/50 text-cream rounded-md transition-all text-sm font-medium"
          >
            Create Your First Recipe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPresetId === preset.id
                  ? 'border-coffee bg-coffee/20 shadow-lg'
                  : 'border-caramel/20 hover:border-coffee/50 bg-olive-dark/30 hover:bg-olive-dark/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <button
                  onClick={() => onPresetChange(preset.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-cream">{preset.name}</h4>
                  </div>
                  <p className="text-xs text-caramel/80">
                    {preset.pours.length} steps • {preset.pours.reduce((sum, p) => sum + p.amount, 0)}g water
                  </p>
                </button>
                <div className="flex items-center gap-2 ml-3">
                  {selectedPresetId === preset.id && (
                    <svg className="w-5 h-5 text-coffee" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPreset(preset);
                    }}
                    className="p-1 text-caramel/60 hover:text-coffee hover:bg-coffee/10 rounded transition-all"
                    title="Edit recipe"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePreset(preset.id);
                    }}
                    className="p-1 text-caramel/60 hover:text-coffee hover:bg-coffee/10 rounded transition-all"
                    title="Delete recipe"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRecipePresetManager;
