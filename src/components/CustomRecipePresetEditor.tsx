import React, { useState } from 'react';
import type { CustomRecipePreset, CustomRecipePour } from '../types/coffee';
import { saveCustomPreset } from '../utils/customRecipeStorage';

interface CustomRecipePresetEditorProps {
  preset?: CustomRecipePreset;
  onSave: () => void;
  onCancel: () => void;
}

const CustomRecipePresetEditor: React.FC<CustomRecipePresetEditorProps> = ({ preset, onSave, onCancel }) => {
  const [name, setName] = useState(preset?.name || '');
  const [pours, setPours] = useState<CustomRecipePour[]>(
    preset?.pours || [
      { amount: 50, timeSeconds: 0, description: 'Bloom' },
      { amount: 100, timeSeconds: 45, description: 'First pour' },
      { amount: 100, timeSeconds: 90, description: 'Second pour' },
    ]
  );

  const handleAddPour = () => {
    const lastPour = pours[pours.length - 1];
    setPours([
      ...pours,
      { amount: 50, timeSeconds: lastPour ? lastPour.timeSeconds + 30 : 0, description: '' },
    ]);
  };

  const handleRemovePour = (index: number) => {
    if (pours.length > 1) {
      setPours(pours.filter((_, i) => i !== index));
    }
  };

  const handlePourChange = (index: number, field: keyof CustomRecipePour, value: string | number) => {
    const newPours = [...pours];
    if (field === 'amount' || field === 'timeSeconds') {
      const numValue = typeof value === 'string' ? (value === '' ? 0 : parseFloat(value)) : value;
      newPours[index][field] = isNaN(numValue) ? 0 : numValue;
    } else {
      newPours[index][field] = value as string;
    }
    setPours(newPours);
  };

  const handleSave = () => {
    if (!name.trim() || pours.length === 0) return;

    const maxTime = Math.max(...pours.map(p => p.timeSeconds));
    
    const newPreset: CustomRecipePreset = {
      id: preset?.id || `custom-${Date.now()}`,
      name: name.trim(),
      pours,
      totalBrewTime: maxTime + 60, // Add 60s buffer for final drawdown
    };

    saveCustomPreset(newPreset);
    onSave();
  };

  const totalWater = pours.reduce((sum, pour) => sum + pour.amount, 0);
  const maxTime = Math.max(...pours.map(p => p.timeSeconds), 0);

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-2xl font-bold text-cream">
            {preset ? 'Edit Custom Recipe' : 'Create Custom Recipe'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-caramel hover:text-cream transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-caramel mb-2">
          Recipe Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Custom Brew"
          className="w-full px-4 py-2 bg-olive-dark/50 border border-coffee/40 rounded-md text-cream placeholder-caramel/50 focus:ring-2 focus:ring-coffee focus:border-coffee"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-olive-dark/50 rounded-lg mb-6">
        <div>
          <div className="text-xs text-caramel/70 mb-1">Total Water</div>
          <div className="text-lg font-bold text-cream">
            {totalWater.toFixed(1)}g
          </div>
        </div>
        <div>
          <div className="text-xs text-caramel/70 mb-1">Last Pour Time</div>
          <div className="text-lg font-bold text-cream">
            {Math.floor(maxTime / 60)}:{(maxTime % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cream">Brew Steps</h3>
        <button
          onClick={handleAddPour}
          className="px-3 py-1.5 bg-coffee/20 hover:bg-coffee/30 border border-coffee/40 text-cream rounded-md transition-all text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Step
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {pours.map((pour, index) => (
          <div key={index} className="flex items-center gap-3 p-4 bg-olive-dark/40 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-coffee/30 rounded-full flex items-center justify-center text-cream font-bold text-sm">
              {index + 1}
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-caramel/70 mb-1">Amount (g)</label>
                <input
                  type="number"
                  value={pour.amount || ''}
                  onChange={(e) => handlePourChange(index, 'amount', e.target.value)}
                  min="0"
                  step="5"
                  className="w-full px-3 py-2 bg-olive-dark/50 border border-coffee/40 rounded-md text-cream focus:ring-2 focus:ring-coffee focus:border-coffee"
                />
              </div>
              <div>
                <label className="block text-xs text-caramel/70 mb-1">Time (seconds)</label>
                <input
                  type="number"
                  value={pour.timeSeconds || ''}
                  onChange={(e) => handlePourChange(index, 'timeSeconds', e.target.value)}
                  min="0"
                  step="5"
                  className="w-full px-3 py-2 bg-olive-dark/50 border border-coffee/40 rounded-md text-cream focus:ring-2 focus:ring-coffee focus:border-coffee"
                />
              </div>
              <div>
                <label className="block text-xs text-caramel/70 mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={pour.description || ''}
                  onChange={(e) => handlePourChange(index, 'description', e.target.value)}
                  placeholder={`Pour ${index + 1}`}
                  className="w-full px-3 py-2 bg-olive-dark/50 border border-coffee/40 rounded-md text-cream placeholder-caramel/50 focus:ring-2 focus:ring-coffee focus:border-coffee"
                />
              </div>
            </div>

            <button
              onClick={() => handleRemovePour(index)}
              disabled={pours.length === 1}
              className="flex-shrink-0 p-2 text-caramel/60 hover:text-coffee hover:bg-coffee/10 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {pours.length === 0 && (
        <div className="mb-6 p-4 bg-coffee/20 rounded-lg text-center">
          <p className="text-sm text-caramel">Add at least one brew step to create your recipe</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-olive-dark/50 hover:bg-olive-dark/70 border border-caramel/30 text-caramel rounded-md transition-all font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim() || pours.length === 0}
          className="flex-1 px-4 py-3 bg-coffee/30 hover:bg-coffee/40 border border-coffee/50 text-cream rounded-md transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Recipe
        </button>
      </div>
    </div>
  );
};

export default CustomRecipePresetEditor;
