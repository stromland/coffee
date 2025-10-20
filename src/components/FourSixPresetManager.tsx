import React, { useState } from 'react';
import type { FourSixPreset } from '../types/coffee';
import { loadPresets, deletePreset } from '../utils/presetStorage';
import FourSixPresetEditor from './FourSixPresetEditor';

interface FourSixPresetManagerProps {
  selectedPresetId: string;
  onPresetChange: (presetId: string) => void;
}

const FourSixPresetManager: React.FC<FourSixPresetManagerProps> = ({ 
  selectedPresetId, 
  onPresetChange 
}) => {
  const [presets, setPresets] = useState<FourSixPreset[]>(loadPresets());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<FourSixPreset | undefined>();

  const handleDeletePreset = (presetId: string) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      deletePreset(presetId);
      setPresets(loadPresets());
      if (selectedPresetId === presetId) {
        onPresetChange('default-46');
      }
    }
  };

  const handleSavePreset = () => {
    setPresets(loadPresets());
    setIsEditorOpen(false);
    setEditingPreset(undefined);
  };

  const handleCreateNew = () => {
    setEditingPreset(undefined);
    setIsEditorOpen(true);
  };

  return (
    <>
      <div className="bg-olive/20 backdrop-blur-sm rounded-lg border border-coffee/30 p-6 shadow-2xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-coffee rounded-full"></div>
            <h3 className="text-lg font-bold text-cream">4:6 Presets</h3>
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
                    {preset.isDefault && (
                      <span className="text-xs bg-caramel/20 text-caramel px-2 py-0.5 rounded border border-caramel/30">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-caramel/80">
                    {preset.pours.length} pours
                  </p>
                </button>
                <div className="flex items-center gap-2 ml-3">
                  {selectedPresetId === preset.id && (
                    <svg className="w-5 h-5 text-coffee" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {!preset.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePreset(preset.id);
                      }}
                      className="p-1 text-caramel/60 hover:text-coffee hover:bg-coffee/10 rounded transition-all"
                      title="Delete preset"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditorOpen && (
        <FourSixPresetEditor
          preset={editingPreset}
          onSave={handleSavePreset}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingPreset(undefined);
          }}
        />
      )}
    </>
  );
};

export default FourSixPresetManager;
