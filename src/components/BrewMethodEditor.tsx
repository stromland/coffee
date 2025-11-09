import React, { useEffect, useState } from "react";
import { brewMethodService } from "../core/services";
import { generateSecureId } from "../shared/utils/idGenerator";
import type { BrewMethod, Pour } from "../types/coffee";

interface BrewMethodEditorProps {
  method: BrewMethod | null;
  onSave: (method: BrewMethod) => void;
  onCancel: () => void;
}

// Step definitions
type WizardStep = "basic" | "helper" | "brewing";

interface BrewingStepData {
  waterGrams: string;
  durationSeconds: string;
  description: string;
}

// LocalStorage key for draft
const DRAFT_STORAGE_KEY = "coffee-brew-method-draft";

const BrewMethodEditor: React.FC<BrewMethodEditorProps> = ({ method, onSave, onCancel }) => {
  // Step navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>("basic");
  const [currentBrewingStepIndex, setCurrentBrewingStepIndex] = useState(0);

  // Step 1: Basic Information
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Step 2: Helper Values
  const [coffeeAmount, setCoffeeAmount] = useState("20");
  const [waterRatio, setWaterRatio] = useState("15");

  // Step 3+: Brewing Steps
  const [brewingSteps, setBrewingSteps] = useState<BrewingStepData[]>([
    { waterGrams: "0", durationSeconds: "30", description: "" },
  ]);

  // Validation errors
  const [errors, setErrors] = useState<string[]>([]);

  // Load method or draft on mount
  useEffect(() => {
    if (method) {
      // Editing existing method
      setName(method.name);
      setDescription(method.description);
      setCategory(method.category || "Custom");

      // Convert percentages back to grams for editing
      const defaultCoffee = 20;
      const defaultRatio = 15;
      const totalWater = defaultCoffee * defaultRatio;

      const steps = method.pours.map((p) => ({
        waterGrams: ((p.percentage / 100) * totalWater).toFixed(0),
        durationSeconds: p.durationSeconds.toString(),
        description: p.description || "",
      }));

      setCoffeeAmount(defaultCoffee.toString());
      setWaterRatio(defaultRatio.toString());
      setBrewingSteps(steps);
    } else {
      // Try to load draft for new method
      loadDraft();
    }
  }, [method]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!method) {
      const draft = {
        name,
        description,
        category,
        coffeeAmount,
        waterRatio,
        brewingSteps,
        currentStep,
        currentBrewingStepIndex,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [
    name,
    description,
    category,
    coffeeAmount,
    waterRatio,
    brewingSteps,
    currentStep,
    currentBrewingStepIndex,
    method,
  ]);

  const loadDraft = () => {
    const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draftJson) {
      try {
        const draft = JSON.parse(draftJson);
        setName(draft.name || "");
        setDescription(draft.description || "");
        setCategory(draft.category || "Custom");
        setCoffeeAmount(draft.coffeeAmount || "20");
        setWaterRatio(draft.waterRatio || "15");
        setBrewingSteps(
          draft.brewingSteps || [{ waterGrams: "0", durationSeconds: "30", description: "" }]
        );
        setCurrentStep(draft.currentStep || "basic");
        setCurrentBrewingStepIndex(draft.currentBrewingStepIndex || 0);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  // Get all categories from existing methods
  const getCategories = (): string[] => {
    const allCategories = brewMethodService.getCategories();
    const uniqueCategories = new Set(allCategories);
    return Array.from(uniqueCategories).sort();
  };

  // Calculate totals
  const calculateTotals = () => {
    const coffee = parseFloat(coffeeAmount) || 0;
    const ratio = parseFloat(waterRatio) || 0;
    const expectedTotalWater = coffee * ratio;

    const gramsNumbers = brewingSteps.map((s) => parseFloat(s.waterGrams) || 0);
    const totalWaterGrams = gramsNumbers.reduce((sum, g) => sum + g, 0);

    const durationsNumbers = brewingSteps.map((s) => parseFloat(s.durationSeconds) || 0);
    const totalBrewTime = durationsNumbers.reduce((sum, d) => sum + d, 0);

    return {
      expectedTotalWater,
      totalWaterGrams,
      totalBrewTime,
      totalPercentage: expectedTotalWater > 0 ? (totalWaterGrams / expectedTotalWater) * 100 : 0,
    };
  };

  // Update brewing step
  const updateBrewingStep = (index: number, field: keyof BrewingStepData, value: string) => {
    const newSteps = [...brewingSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setBrewingSteps(newSteps);
  };

  // Add brewing step
  const addBrewingStep = () => {
    setBrewingSteps([...brewingSteps, { waterGrams: "0", durationSeconds: "30", description: "" }]);
    setCurrentBrewingStepIndex(brewingSteps.length);
  };

  // Remove brewing step
  const removeBrewingStep = (index: number) => {
    if (brewingSteps.length <= 1) {
      alert("Method must have at least one brewing step");
      return;
    }
    const newSteps = brewingSteps.filter((_, i) => i !== index);
    setBrewingSteps(newSteps);
    if (currentBrewingStepIndex >= newSteps.length) {
      setCurrentBrewingStepIndex(Math.max(0, newSteps.length - 1));
    }
  };

  // Check if current step is valid (without setting errors)
  const isCurrentStepValid = (): boolean => {
    if (currentStep === "basic") {
      return name.trim() !== "" && category.trim() !== "";
    } else if (currentStep === "helper") {
      const coffee = parseFloat(coffeeAmount);
      const ratio = parseFloat(waterRatio);
      return !isNaN(coffee) && coffee > 0 && !isNaN(ratio) && ratio > 0;
    } else if (currentStep === "brewing") {
      const step = brewingSteps[currentBrewingStepIndex];
      if (step) {
        const water = parseFloat(step.waterGrams);
        const duration = parseFloat(step.durationSeconds);
        return !isNaN(water) && water > 0 && !isNaN(duration) && duration > 0;
      }
    }
    return true;
  };

  // Validate current step and set errors
  const validateCurrentStep = (): boolean => {
    const newErrors: string[] = [];

    if (currentStep === "basic") {
      if (!name.trim()) {
        newErrors.push("Method name is required");
      }
      if (!category.trim()) {
        newErrors.push("Category is required");
      }
    } else if (currentStep === "helper") {
      const coffee = parseFloat(coffeeAmount);
      const ratio = parseFloat(waterRatio);
      if (isNaN(coffee) || coffee <= 0) {
        newErrors.push("Coffee amount must be greater than 0");
      }
      if (isNaN(ratio) || ratio <= 0) {
        newErrors.push("Water ratio must be greater than 0");
      }
    } else if (currentStep === "brewing") {
      const step = brewingSteps[currentBrewingStepIndex];
      if (step) {
        const water = parseFloat(step.waterGrams);
        const duration = parseFloat(step.durationSeconds);
        if (isNaN(water) || water <= 0) {
          newErrors.push("Water amount must be greater than 0");
        }
        if (isNaN(duration) || duration <= 0) {
          newErrors.push("Duration must be greater than 0");
        }
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Check if method is valid (without setting errors)
  const isMethodValid = (): boolean => {
    if (!name.trim()) return false;
    if (brewingSteps.length === 0) return false;

    const { totalPercentage } = calculateTotals();
    if (Math.abs(totalPercentage - 100) > 0.01) return false;

    for (const step of brewingSteps) {
      const water = parseFloat(step.waterGrams);
      const duration = parseFloat(step.durationSeconds);
      if (isNaN(water) || water < 0) return false;
      if (isNaN(duration) || duration <= 0) return false;
    }

    return true;
  };

  // Validate entire method for final save
  const validateMethod = (): boolean => {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push("Method name is required");
    }

    if (brewingSteps.length === 0) {
      newErrors.push("At least one brewing step is required");
    }

    const { totalPercentage } = calculateTotals();
    if (Math.abs(totalPercentage - 100) > 0.01) {
      newErrors.push(
        `Total water amount is ${totalPercentage.toFixed(1)}%. It must equal 100% to create a valid brewing recipe.`
      );
    }

    brewingSteps.forEach((step, i) => {
      const water = parseFloat(step.waterGrams);
      const duration = parseFloat(step.durationSeconds);
      if (isNaN(water) || water < 0) {
        newErrors.push(`Brewing step ${i + 1}: water amount cannot be negative`);
      }
      if (isNaN(duration) || duration <= 0) {
        newErrors.push(`Brewing step ${i + 1}: duration must be greater than 0`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validateMethod()) {
      return;
    }

    // Convert brewing steps to pours with percentages
    const { expectedTotalWater } = calculateTotals();
    const pours: Pour[] = brewingSteps.map((step) => {
      const water = parseFloat(step.waterGrams) || 0;
      const percentage = expectedTotalWater > 0 ? (water / expectedTotalWater) * 100 : 0;
      return {
        percentage,
        durationSeconds: parseFloat(step.durationSeconds) || 0,
        description: step.description.trim() || undefined,
      };
    });

    const savedMethod: BrewMethod = {
      id: method?.id || generateSecureId("method"),
      name: name.trim(),
      description: description.trim(),
      category,
      pours,
      isDefault: false,
      isCustom: true,
    };

    clearDraft();
    onSave(savedMethod);
  };

  // Navigation handlers
  const goToStep = (step: WizardStep, brewingIndex: number = 0) => {
    if (validateCurrentStep()) {
      setCurrentStep(step);
      if (step === "brewing") {
        setCurrentBrewingStepIndex(brewingIndex);
      }
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === "basic") {
      goToStep("helper");
    } else if (currentStep === "helper") {
      goToStep("brewing", 0);
    } else if (currentStep === "brewing") {
      // Move to next brewing step or stay on current
      if (currentBrewingStepIndex < brewingSteps.length - 1) {
        setCurrentBrewingStepIndex(currentBrewingStepIndex + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === "helper") {
      goToStep("basic");
    } else if (currentStep === "brewing") {
      if (currentBrewingStepIndex > 0) {
        setCurrentBrewingStepIndex(currentBrewingStepIndex - 1);
      } else {
        goToStep("helper");
      }
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
      clearDraft();
      onCancel();
    }
  };

  const totals = calculateTotals();

  // Calculate cumulative values up to current brewing step
  const getCumulativeValues = (upToIndex: number) => {
    let cumulativeWater = 0;
    let cumulativeTime = 0;
    for (let i = 0; i <= upToIndex && i < brewingSteps.length; i++) {
      cumulativeWater += parseFloat(brewingSteps[i].waterGrams) || 0;
      cumulativeTime += parseFloat(brewingSteps[i].durationSeconds) || 0;
    }
    return { cumulativeWater, cumulativeTime };
  };

  // Determine total steps
  const getTotalSteps = () => {
    return 2 + brewingSteps.length; // basic + helper + brewing steps
  };

  const getCurrentStepNumber = () => {
    if (currentStep === "basic") return 1;
    if (currentStep === "helper") return 2;
    return 3 + currentBrewingStepIndex;
  };

  const totalSteps = getTotalSteps();
  const currentStepNumber = getCurrentStepNumber();
  const progressPercentage = (currentStepNumber / totalSteps) * 100;

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-cream">
            {method?.id ? "Edit Method" : "Create New Method"}
          </h2>
        </div>
        <div className="text-sm text-caramel/70">
          Step {currentStepNumber} of {totalSteps}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-olive-dark/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-coffee transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === "basic" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cream mb-4">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">Method Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Custom Recipe"
                className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream placeholder-caramel/50 focus:outline-none focus:border-coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this method"
                rows={3}
                className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream placeholder-caramel/50 focus:outline-none focus:border-coffee resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">Category *</label>
              {!isAddingCategory ? (
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream focus:outline-none focus:border-coffee cursor-pointer pr-24 appearance-none"
                  >
                    {getCategories().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-caramel"
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
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(true);
                      setNewCategoryName("");
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 px-3 py-1 bg-coffee/30 hover:bg-coffee/40 text-cream text-sm rounded transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream placeholder-caramel/50 focus:outline-none focus:border-coffee"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategoryName.trim()) {
                          setCategory(newCategoryName.trim());
                          setIsAddingCategory(false);
                          setNewCategoryName("");
                        }
                      }}
                      disabled={!newCategoryName.trim()}
                      className="flex-1 px-4 py-2 bg-coffee hover:bg-coffee/80 text-cream rounded-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName("");
                      }}
                      className="flex-1 px-4 py-2 bg-olive-dark/50 hover:bg-olive-dark/70 text-caramel hover:text-cream rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-caramel/70 mt-1">
                {isAddingCategory
                  ? "Enter a name for the new category"
                  : "Select a category or create a new one"}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Helper Values */}
        {currentStep === "helper" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cream mb-4">Helper Values</h3>

            <div className="p-4 bg-olive-dark/30 rounded-lg border border-coffee/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Coffee Amount (grams) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={coffeeAmount}
                    onChange={(e) => setCoffeeAmount(e.target.value)}
                    placeholder="20"
                    className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream focus:outline-none focus:border-coffee"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Water Ratio (1:X) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={waterRatio}
                    onChange={(e) => setWaterRatio(e.target.value)}
                    placeholder="15"
                    className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream focus:outline-none focus:border-coffee"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-caramel/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-caramel/70">Total Water</span>
                  <span className="text-lg font-semibold text-cream">
                    {totals.expectedTotalWater.toFixed(0)}g
                  </span>
                </div>
                <p className="text-xs text-caramel/70 mt-2">
                  This is calculated as coffee amount × water ratio. You can navigate back to adjust
                  these values at any time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3+: Brewing Steps */}
        {currentStep === "brewing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cream">
                Brewing Step {currentBrewingStepIndex + 1} of {brewingSteps.length}
              </h3>
              <button
                onClick={() => goToStep("helper")}
                className="text-xs text-caramel hover:text-cream underline"
              >
                Edit coffee/water values
              </button>
            </div>

            {/* Progress Summary */}
            <div className="p-4 bg-olive-dark/30 rounded-lg border border-coffee/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-caramel/70">Total Water Used:</span>
                  <span
                    className={`ml-2 font-semibold ${
                      totals.totalPercentage > 100 ? "text-red-400" : "text-cream"
                    }`}
                  >
                    {totals.totalWaterGrams.toFixed(0)}g / {totals.expectedTotalWater.toFixed(0)}g
                  </span>
                  <span className="ml-2 text-xs text-caramel/70">
                    ({totals.totalPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div>
                  <span className="text-caramel/70">Total Time:</span>
                  <span className="ml-2 font-semibold text-cream">
                    {Math.floor(totals.totalBrewTime / 60)}:
                    {(totals.totalBrewTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Warning message when not equal to 100% */}
              {Math.abs(totals.totalPercentage - 100) > 0.01 && (
                <div className="mt-3 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div>
                      <p className="text-red-300 font-semibold text-sm">
                        Total water must equal 100%
                      </p>
                      <p className="text-red-200 text-xs mt-1">
                        {totals.totalPercentage < 100
                          ? "Add more water or reduce coffee/ratio values"
                          : "Reduce water amounts or increase coffee/ratio values"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current Brewing Step Form */}
            <div className="p-4 bg-olive-dark/30 rounded-lg border border-coffee/30">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Water Amount (grams) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={brewingSteps[currentBrewingStepIndex]?.waterGrams || ""}
                    onChange={(e) =>
                      updateBrewingStep(currentBrewingStepIndex, "waterGrams", e.target.value)
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream focus:outline-none focus:border-coffee"
                  />
                  {(() => {
                    const { cumulativeWater } = getCumulativeValues(currentBrewingStepIndex);
                    return (
                      <p className="text-xs text-caramel/70 mt-1">
                        Cumulative: {cumulativeWater.toFixed(0)}g
                      </p>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Duration (seconds) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={brewingSteps[currentBrewingStepIndex]?.durationSeconds || ""}
                    onChange={(e) =>
                      updateBrewingStep(currentBrewingStepIndex, "durationSeconds", e.target.value)
                    }
                    placeholder="30"
                    className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream focus:outline-none focus:border-coffee"
                  />
                  {(() => {
                    const { cumulativeTime } = getCumulativeValues(currentBrewingStepIndex);
                    return (
                      <p className="text-xs text-caramel/70 mt-1">
                        Cumulative: {Math.floor(cumulativeTime / 60)}:
                        {(cumulativeTime % 60).toString().padStart(2, "0")}
                      </p>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={brewingSteps[currentBrewingStepIndex]?.description || ""}
                    onChange={(e) =>
                      updateBrewingStep(currentBrewingStepIndex, "description", e.target.value)
                    }
                    placeholder="e.g., Bloom phase, swirl gently"
                    className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream placeholder-caramel/50 focus:outline-none focus:border-coffee"
                  />
                </div>
              </div>
            </div>

            {/* All Brewing Steps Overview */}
            {brewingSteps.length > 1 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-cream">All Brewing Steps</h4>
                <div className="space-y-2">
                  {brewingSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        index === currentBrewingStepIndex
                          ? "bg-coffee/20 border-coffee"
                          : "bg-olive-dark/20 border-caramel/20"
                      } cursor-pointer hover:bg-olive-dark/30 transition-colors`}
                      onClick={() => {
                        if (validateCurrentStep()) {
                          setCurrentBrewingStepIndex(index);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-coffee/20 flex items-center justify-center text-cream text-xs font-semibold">
                            {index + 1}
                          </div>
                          <div className="text-sm">
                            <span className="text-cream font-medium">{step.waterGrams}g</span>
                            <span className="text-caramel/70 mx-2">•</span>
                            <span className="text-cream">{step.durationSeconds}s</span>
                            {step.description && (
                              <>
                                <span className="text-caramel/70 mx-2">•</span>
                                <span className="text-caramel/80">{step.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {brewingSteps.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBrewingStep(index);
                            }}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                            title="Remove step"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-red-300 font-semibold mb-2">Please fix the following:</p>
                <ul className="space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-red-200 text-sm flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-caramel/20">
          {/* Back button */}
          <button
            onClick={handleBack}
            disabled={currentStep === "basic"}
            className="flex-1 px-6 py-3 bg-olive-dark/50 hover:bg-olive-dark/70 text-caramel hover:text-cream rounded-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          {/* Cancel button */}
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-olive-dark/50 hover:bg-olive-dark/70 text-caramel hover:text-cream rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>

          {/* Brewing step actions */}
          {currentStep === "brewing" && (
            <>
              <button
                onClick={addBrewingStep}
                disabled={!isCurrentStepValid()}
                className="flex-1 px-6 py-3 bg-coffee/30 hover:bg-coffee/40 text-cream rounded-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Brewing Step
              </button>
              <button
                onClick={handleSave}
                disabled={!isMethodValid()}
                className="flex-1 px-6 py-3 bg-coffee hover:bg-coffee/80 text-cream rounded-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Save Method
              </button>
            </>
          )}

          {/* Next button for basic and helper steps */}
          {currentStep !== "brewing" && (
            <button
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className="flex-1 px-6 py-3 bg-coffee hover:bg-coffee/80 text-cream rounded-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrewMethodEditor;
