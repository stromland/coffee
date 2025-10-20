import React, { useState } from 'react';
import type { FourSixPreset, FourSixPour } from '../types/coffee';
import { validateFourSixPreset } from '../utils/fourSixValidator';
import { savePreset } from '../utils/presetStorage';

interface FourSixPresetEditorProps {
  preset?: FourSixPreset;
  onSave: () => void;
  onCancel: () => void;
}

const FourSixPresetEditor: React.FC<FourSixPresetEditorProps> = ({ preset, onSave, onCancel }) => {
  const [name, setName] = useState(preset?.name || '');
  const [pours, setPours] = useState<FourSixPour[]>(
    preset?.pours || [
      { amount: 50, timeSeconds: 0 },
      { amount: 70, timeSeconds: 45 },
      { amount: 90, timeSeconds: 90 },
      { amount: 90, timeSeconds: 135 },
    ]
  );

  const validation = validateFourSixPreset(pours);

  const handleAddPour = () => {
    const lastPour = pours[pours.length - 1];
    setPours([
      ...pours,
      { amount: 50, timeSeconds: lastPour ? lastPour.timeSeconds + 30 : 0 },
    ]);
  };

  const handleRemovePour = (index: number) => {
    if (pours.length > 1) {
      setPours(pours.filter((_, i) => i !== index));
    }
  };

  const handlePourChange = (index: number, field: 'amount' | 'timeSeconds', value: number) => {
    const newPours = [...pours];
    newPours[index][field] = value;
    setPours(newPours);
  };

  const handleSave = () => {
    if (!validation.isValid || !name.trim()) return;

    const newPreset: FourSixPreset = {
      id: preset?.id || `custom-${Date.now()}`,
      name: name.trim(),
      pours,
      isDefault: false,
    };

    savePreset(newPreset);
    onSave();
  };

  const totalWater = pours.reduce((sum, pour) => sum + pour.amount, 0);

  return (
    <div className="fixed inset-0 bg-olive-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-olive/30 border border-coffee/40 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-olive-dark/95 border-b border-coffee/30 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-cream">
              {preset ? 'Edit Preset' : 'Create New 4:6 Preset'}
            </h2>
            <button
              onClick={onCancel}
              className="text-caramel hover:text-cream transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-caramel mb-2">
              Preset Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom 4:6"
              className="w-full px-4 py-2 bg-olive-dark/50 border border-coffee/40 rounded-md text-cream placeholder-caramel/50 focus:ring-2 focus:ring-coffee focus:border-coffee"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-olive-dark/50 rounded-lg border border-caramel/20">
            <div>
              <div className="text-xs text-caramel/70 mb-1">Total Water</div>
              <div className={`text-lg font-bold ${Math.abs(totalWater - 300) > 0.1 ? 'text-coffee' : 'text-cream'}`}>
                {totalWater.toFixed(1)}g
              </div>
            </div>
            <div>
              <div className="text-xs text-caramel/70 mb-1">Phase 1 (40%)</div>
              <div className={`text-lg font-bold ${validation.isValid ? 'text-cream' : 'text-coffee'}`}>
                {validation.phase1Total.toFixed(1)}g
              </div>
            </div>
            <div>
              <div className="text-xs text-caramel/70 mb-1">Phase 2 (60%)</div>
              <div className={`text-lg font-bold ${validation.isValid ? 'text-cream' : 'text-coffee'}`}>
                {validation.phase2Total.toFixed(1)}g
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-cream">Pours</h3>
            <button
              onClick={handleAddPour}
              className="px-3 py-1.5 bg-coffee/20 hover:bg-coffee/30 border border-coffee/40 text-cream rounded-md transition-all text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Pour
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {pours.map((pour, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-olive-dark/40 rounded-lg border border-caramel/20">
                <div className="flex-shrink-0 w-8 h-8 bg-coffee/30 rounded-full flex items-center justify-center text-cream font-bold text-sm border border-coffee/50">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-caramel/70 mb-1">Amount (g)</label>
                    <input
                      type="number"
                      value={pour.amount}
                      onChange={(e) => handlePourChange(index, 'amount', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="5"
                      className="w-full px-3 py-2 bg-olive-dark/50 border border-coffee/40 rounded-md text-cream focus:ring-2 focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-caramel/70 mb-1">Time (seconds)</label>
                    <input
                      type="number"
                      value={pour.timeSeconds}
                      onChange={(e) => handlePourChange(index, 'timeSeconds', parseInt(e.target.value) || 0)}
                      min="0"
                      step="5"
                      className="w-full px-3 py-2 bg-olive-dark/50 border border-coffee/40 rounded-md text-cream focus:ring-2 focus:ring-coffee focus:border-coffee"
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

          {validation.errors.length > 0 && (
            <div className="mb-6 p-4 bg-coffee/20 border border-coffee/40 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-coffee flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-coffee mb-1">Validation Errors</h4>
                  <ul className="text-xs text-caramel space-y-1">
                    {validation.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
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
              disabled={!validation.isValid || !name.trim()}
              className="flex-1 px-4 py-3 bg-coffee/30 hover:bg-coffee/40 border border-coffee/50 text-cream rounded-md transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Preset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourSixPresetEditor;
