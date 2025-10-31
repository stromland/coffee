import React, { useState, useEffect } from 'react';
import type { BrewMethod, Pour } from '../types/coffee';
import { generateSecureId } from '../shared/utils/idGenerator';

interface BrewMethodEditorProps {
  method: BrewMethod | null;
  onSave: (method: BrewMethod) => void;
  onCancel: () => void;
}

const BrewMethodEditor: React.FC<BrewMethodEditorProps> = ({ method, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Custom');
  const [drawdownTime, setDrawdownTime] = useState(60);
  const [pours, setPours] = useState<Pour[]>([
    { percentage: 100, timeSeconds: 0, description: '' },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (method) {
      setName(method.name);
      setDescription(method.description);
      setCategory(method.category || 'Custom');
      setDrawdownTime(method.drawdownTime);
      setPours(method.pours.map(p => ({ ...p })));
    }
  }, [method]);

  const handleAddPour = () => {
    const lastPour = pours[pours.length - 1];
    const newTime = lastPour ? lastPour.timeSeconds + 30 : 0;
    setPours([...pours, { percentage: 0, timeSeconds: newTime, description: '' }]);
  };

  const handleRemovePour = (index: number) => {
    if (pours.length <= 1) {
      alert('Method must have at least one pour');
      return;
    }
    setPours(pours.filter((_, i) => i !== index));
  };

  const handlePourChange = (index: number, field: keyof Pour, value: string | number) => {
    const newPours = [...pours];
    if (field === 'percentage' || field === 'timeSeconds') {
      newPours[index] = { ...newPours[index], [field]: Number(value) };
    } else if (field === 'description') {
      newPours[index] = { ...newPours[index], [field]: String(value) };
    }
    setPours(newPours);
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push('Method name is required');
    }

    if (pours.length === 0) {
      newErrors.push('At least one pour is required');
    }

    const totalPercentage = pours.reduce((sum, p) => sum + p.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      newErrors.push(`Total percentage must equal 100% (currently ${totalPercentage.toFixed(1)}%)`);
    }

    pours.forEach((pour, i) => {
      if (pour.percentage <= 0) {
        newErrors.push(`Pour ${i + 1}: percentage must be greater than 0`);
      }
      if (pour.percentage > 100) {
        newErrors.push(`Pour ${i + 1}: percentage cannot exceed 100`);
      }
      if (pour.timeSeconds < 0) {
        newErrors.push(`Pour ${i + 1}: time cannot be negative`);
      }
    });

    // Check times are in ascending order
    for (let i = 1; i < pours.length; i++) {
      if (pours[i].timeSeconds < pours[i - 1].timeSeconds) {
        newErrors.push('Pour times must be in ascending order');
        break;
      }
    }

    if (drawdownTime < 0) {
      newErrors.push('Drawdown time cannot be negative');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const savedMethod: BrewMethod = {
      id: method?.id || generateSecureId('method'),
      name: name.trim(),
      description: description.trim(),
      category,
      drawdownTime,
      pours: pours.map(p => ({
        percentage: p.percentage,
        timeSeconds: p.timeSeconds,
        description: p.description?.trim() || undefined,
      })),
      isDefault: false,
      isCustom: true,
    };

    onSave(savedMethod);
  };

  const totalPercentage = pours.reduce((sum, p) => sum + p.percentage, 0);
  const totalBrewTime = pours.length > 0 
    ? Math.max(...pours.map(p => p.timeSeconds)) + drawdownTime
    : drawdownTime;

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-cream">
            {method?.id ? 'Edit Method' : 'Create New Method'}
          </h2>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <h3 className="text-red-400 font-semibold mb-2">Please fix the following errors:</h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-red-300 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cream mb-2">
              Method Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Custom Recipe"
              className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream placeholder-caramel/50 focus:outline-none focus:border-coffee"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this method"
              className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream placeholder-caramel/50 focus:outline-none focus:border-coffee"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Custom"
                className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream placeholder-caramel/50 focus:outline-none focus:border-coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                Drawdown Time (seconds)
              </label>
              <input
                type="number"
                value={drawdownTime}
                onChange={(e) => setDrawdownTime(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream focus:outline-none focus:border-coffee"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-olive-dark/30 rounded-lg border border-coffee/30">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-caramel/70">Total %:</span>
              <span className={`ml-2 font-semibold ${Math.abs(totalPercentage - 100) < 0.01 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPercentage.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-caramel/70">Pours:</span>
              <span className="ml-2 font-semibold text-cream">{pours.length}</span>
            </div>
            <div>
              <span className="text-caramel/70">Total Time:</span>
              <span className="ml-2 font-semibold text-cream">
                {Math.floor(totalBrewTime / 60)}:{(totalBrewTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Pours */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-cream">
              Pours (total must equal 100%)
            </label>
            <button
              onClick={handleAddPour}
              className="px-3 py-1 bg-coffee/30 hover:bg-coffee/40 text-cream rounded text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Pour
            </button>
          </div>

          <div className="space-y-3">
            {pours.map((pour, index) => (
              <div key={index} className="p-4 bg-olive-dark/30 rounded-lg border border-caramel/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-coffee/20 flex items-center justify-center text-cream font-semibold text-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-caramel/70 mb-1">Percentage %</label>
                      <input
                        type="number"
                        value={pour.percentage}
                        onChange={(e) => handlePourChange(index, 'percentage', e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-3 py-2 bg-olive-dark/50 border border-caramel/30 rounded text-cream text-sm focus:outline-none focus:border-coffee"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-caramel/70 mb-1">Time (seconds)</label>
                      <input
                        type="number"
                        value={pour.timeSeconds}
                        onChange={(e) => handlePourChange(index, 'timeSeconds', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 bg-olive-dark/50 border border-caramel/30 rounded text-cream text-sm focus:outline-none focus:border-coffee"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-caramel/70 mb-1">Description</label>
                      <input
                        type="text"
                        value={pour.description || ''}
                        onChange={(e) => handlePourChange(index, 'description', e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 bg-olive-dark/50 border border-caramel/30 rounded text-cream text-sm placeholder-caramel/50 focus:outline-none focus:border-coffee"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemovePour(index)}
                    disabled={pours.length <= 1}
                    className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Remove pour"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-coffee hover:bg-coffee/80 text-cream rounded-lg font-semibold transition-colors"
          >
            Save Method
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-olive-dark/50 hover:bg-olive-dark/70 text-caramel hover:text-cream rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrewMethodEditor;
