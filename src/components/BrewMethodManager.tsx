import React, { useState, useEffect } from 'react';
import type { BrewMethod } from '../types/coffee';
import { brewMethodService } from '../core/services';
import BrewMethodEditor from './BrewMethodEditor';

interface BrewMethodManagerProps {
  onMethodChange?: (methodId: string) => void;
}

const BrewMethodManager: React.FC<BrewMethodManagerProps> = ({ onMethodChange }) => {
  const [methods, setMethods] = useState<BrewMethod[]>([]);
  const [customMethods, setCustomMethods] = useState<BrewMethod[]>([]);
  const [editingMethod, setEditingMethod] = useState<BrewMethod | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = () => {
    setMethods(brewMethodService.getAllMethods());
    setCustomMethods(brewMethodService.getCustomMethods());
  };

  const handleDelete = (methodId: string) => {
    const method = brewMethodService.getMethodById(methodId);
    if (!method) return;

    if (method.isDefault) {
      alert('Cannot delete default methods');
      return;
    }

    if (confirm(`Are you sure you want to delete "${method.name}"?`)) {
      brewMethodService.deleteMethod(methodId);
      loadMethods();
    }
  };

  const handleEdit = (method: BrewMethod) => {
    if (method.isDefault) {
      alert('Cannot edit default methods. Create a copy instead.');
      return;
    }
    setEditingMethod(method);
  };

  const handleDuplicate = (method: BrewMethod) => {
    const newMethod: BrewMethod = {
      ...method,
      id: '', // Will be set by editor
      name: `${method.name} (Copy)`,
      isDefault: false,
      isCustom: true,
      category: 'Custom',
    };
    setEditingMethod(newMethod);
  };

  const handleSave = (method: BrewMethod) => {
    brewMethodService.saveMethod(method);
    setEditingMethod(null);
    setIsCreating(false);
    loadMethods();
    
    if (onMethodChange) {
      onMethodChange(method.id);
    }
  };

  const handleCancel = () => {
    setEditingMethod(null);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingMethod({
      id: '',
      name: '',
      description: '',
      category: 'Custom',
      drawdownTime: 60,
      pours: [
        { percentage: 100, timeSeconds: 0, description: 'Pour all water' },
      ],
      isDefault: false,
      isCustom: true,
    });
  };

  if (editingMethod || isCreating) {
    return (
      <BrewMethodEditor
        method={editingMethod}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  // Group methods by category
  const categories = new Map<string, BrewMethod[]>();
  methods.forEach((method) => {
    const category = method.category || 'Other';
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(method);
  });

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-cream">Brew Methods</h2>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-coffee hover:bg-coffee/80 text-cream rounded-lg transition-all font-medium text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Method
        </button>
      </div>

      <div className="space-y-4">
        {Array.from(categories.entries()).map(([category, categoryMethods]) => (
          <div key={category} className="border border-caramel/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              className="w-full px-4 py-3 bg-olive-dark/30 hover:bg-olive-dark/50 transition-colors flex items-center justify-between"
            >
              <span className="font-semibold text-cream">{category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-caramel/70">
                  {categoryMethods.length} {categoryMethods.length === 1 ? 'method' : 'methods'}
                </span>
                <svg
                  className={`w-5 h-5 text-caramel transition-transform ${
                    expandedCategory === category ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedCategory === category && (
              <div className="divide-y divide-caramel/10">
                {categoryMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 bg-olive-dark/20 hover:bg-olive-dark/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-cream">{method.name}</h3>
                          {method.isDefault && (
                            <span className="px-2 py-0.5 bg-coffee/20 text-coffee text-xs rounded-full border border-coffee/30">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-caramel/80 mb-2">{method.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-caramel/70">
                          <span>{method.pours.length} pours</span>
                          <span>•</span>
                          <span>Drawdown: {method.drawdownTime}s</span>
                          {method.creditName && (
                            <>
                              <span>•</span>
                              <span>by {method.creditName}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDuplicate(method)}
                          className="p-2 text-caramel hover:text-cream hover:bg-olive-dark/50 rounded transition-colors"
                          title="Duplicate"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        
                        {!method.isDefault && (
                          <>
                            <button
                              onClick={() => handleEdit(method)}
                              className="p-2 text-caramel hover:text-cream hover:bg-olive-dark/50 rounded transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(method.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {customMethods.length === 0 && (
        <div className="mt-6 p-6 bg-olive-dark/30 rounded-lg text-center">
          <p className="text-caramel/70 text-sm">
            No custom methods yet. Click "Create Method" to add your own brewing recipe.
          </p>
        </div>
      )}
    </div>
  );
};

export default BrewMethodManager;
