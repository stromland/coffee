import React, { useState } from "react";
import { brewingService } from "../core/services";

interface BrewingPresetsProps {
  selectedMethodId: string;
  onMethodChange: (methodId: string) => void;
}

const BrewingPresets: React.FC<BrewingPresetsProps> = ({ selectedMethodId, onMethodChange }) => {
  const brewMethods = brewingService.getAllBrewMethods();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [hasInitialized, setHasInitialized] = useState(false);

  // Group methods by category
  const categories = new Map<string, typeof brewMethods>();
  brewMethods.forEach((method) => {
    const category = method.category || "Other";
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(method);
  });

  // Auto-expand the category containing the selected method only on initial mount
  React.useEffect(() => {
    if (!hasInitialized) {
      const selectedMethod = brewMethods.find((m) => m.id === selectedMethodId);
      if (selectedMethod) {
        setExpandedCategories(new Set([selectedMethod.category || "Other"]));
      }
      setHasInitialized(true);
    }
  }, [selectedMethodId, brewMethods, hasInitialized]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const isCategoryExpanded = (category: string) => expandedCategories.has(category);

  const hasSelectedMethod = (categoryMethods: typeof brewMethods) => {
    return categoryMethods.some((m) => m.id === selectedMethodId);
  };

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-coffee rounded-full"></div>
        <h2 className="text-xl font-bold text-cream">Brewing Method</h2>
      </div>

      <div className="space-y-3">
        {Array.from(categories.entries()).map(([category, categoryMethods]) => {
          const isExpanded = isCategoryExpanded(category);
          const hasSelection = hasSelectedMethod(categoryMethods);
          const selectedMethod = hasSelection
            ? categoryMethods.find((m) => m.id === selectedMethodId)
            : null;

          return (
            <div key={category} className="border border-caramel/20 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-2.5 bg-olive-dark/30 hover:bg-olive-dark/50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-cream text-sm">{category}</span>
                  {!isExpanded && hasSelection && selectedMethod && (
                    <span className="text-xs text-coffee">• {selectedMethod.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-caramel/70">{categoryMethods.length}</span>
                  <svg
                    className={`w-4 h-4 text-caramel transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="bg-olive-dark/10">
                  {categoryMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => onMethodChange(method.id)}
                      className={`w-full p-3 transition-all text-left border-l-4 ${
                        selectedMethodId === method.id
                          ? "bg-coffee/20 border-coffee"
                          : "bg-transparent hover:bg-olive-dark/30 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-cream">{method.name}</h3>
                          <p className="text-xs text-caramel/70 mt-0.5 leading-relaxed">
                            {method.description}
                          </p>
                        </div>
                        {selectedMethodId === method.id && (
                          <div className="ml-3 flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-coffee"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrewingPresets;
