import React, { useEffect, useState } from "react";
import { Modal } from "../shared/components/ui";
import { generateSecureId } from "../shared/utils/idGenerator";
import type { BrewMethod, Pour } from "../types/coffee";

interface BrewMethodEditorProps {
  method: BrewMethod | null;
  onSave: (method: BrewMethod) => void;
  onCancel: () => void;
}

const BrewMethodEditor: React.FC<BrewMethodEditorProps> = ({ method, onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom");
  const [drawdownTime, setDrawdownTime] = useState(60);
  const [pours, setPours] = useState<Pour[]>([
    { percentage: 0, atTimeSeconds: 0, description: "" },
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // UI state for gram-based input
  const [coffeeAmount, setCoffeeAmount] = useState("20");
  const [waterRatio, setWaterRatio] = useState("15");
  const [pourGrams, setPourGrams] = useState<string[]>(["0"]);
  const [pourTimes, setPourTimes] = useState<string[]>(["0"]);

  useEffect(() => {
    if (method) {
      setName(method.name);
      setDescription(method.description);
      setCategory(method.category || "Custom");
      setDrawdownTime(method.drawdownTime);
      setPours(method.pours.map((p) => ({ ...p })));

      // Convert percentages back to grams for editing
      // Default to a reasonable coffee amount for conversion
      const defaultCoffee = 20;
      const defaultRatio = 15;
      const totalWater = defaultCoffee * defaultRatio;
      const grams = method.pours.map((p) => ((p.percentage / 100) * totalWater).toFixed(0));
      const times = method.pours.map((p) => p.atTimeSeconds.toString());

      setCoffeeAmount(defaultCoffee.toString());
      setWaterRatio(defaultRatio.toString());
      setPourGrams(grams);
      setPourTimes(times);
    }
  }, [method]);

  const handleAddPour = () => {
    const lastPour = pours[pours.length - 1];
    const newTime = lastPour ? lastPour.atTimeSeconds + 30 : 0;
    setPours([...pours, { percentage: 0, atTimeSeconds: newTime, description: "" }]);
    setPourGrams([...pourGrams, "0"]);
    setPourTimes([...pourTimes, newTime.toString()]);
  };

  const handleRemovePour = (index: number) => {
    if (pours.length <= 1) {
      alert("Method must have at least one pour");
      return;
    }
    setPours(pours.filter((_, i) => i !== index));
    setPourGrams(pourGrams.filter((_, i) => i !== index));
    setPourTimes(pourTimes.filter((_, i) => i !== index));
  };

  const handlePourGramsChange = (index: number, value: string) => {
    const newGrams = [...pourGrams];
    newGrams[index] = value;
    setPourGrams(newGrams);

    // Calculate percentages based on expected total water (coffee × ratio)
    const coffee = parseFloat(coffeeAmount) || 0;
    const ratio = parseFloat(waterRatio) || 0;
    const expectedTotal = coffee * ratio;

    const gramsNumbers = newGrams.map((g) => parseFloat(g) || 0);
    const newPours = pours.map((pour, i) => ({
      ...pour,
      percentage: expectedTotal > 0 ? (gramsNumbers[i] / expectedTotal) * 100 : 0,
    }));
    setPours(newPours);
  };

  const handlePourTimeChange = (index: number, value: string) => {
    const newTimes = [...pourTimes];
    newTimes[index] = value;
    setPourTimes(newTimes);

    // Update pours with new time
    const newPours = [...pours];
    newPours[index] = {
      ...newPours[index],
      atTimeSeconds: parseFloat(value) || 0,
    };
    setPours(newPours);
  };

  /**
   * Recalculate pour grams based on coffee amount, water ratio, and current pour grams.
   * Returns a new array of pour grams as strings.
   */
  const recalculatePourGrams = (
    coffeeAmountValue: string,
    waterRatioValue: string,
    currentPourGrams: string[]
  ): string[] => {
    const coffee = parseFloat(coffeeAmountValue);
    const ratio = parseFloat(waterRatioValue);
    if (!isNaN(coffee) && coffee > 0 && !isNaN(ratio) && ratio > 0) {
      const totalWater = coffee * ratio;
      const gramsNumbers = currentPourGrams.map((g) => parseFloat(g) || 0);
      const currentTotal = gramsNumbers.reduce((sum, g) => sum + g, 0);
      if (currentTotal > 0) {
        return gramsNumbers.map((g) => ((g / currentTotal) * totalWater).toFixed(1));
      }
    }
    return currentPourGrams;
  };

  const handleCoffeeAmountChange = (value: string) => {
    setCoffeeAmount(value);
    const newGrams = recalculatePourGrams(value, waterRatio, pourGrams);
    if (newGrams !== pourGrams) {
      setPourGrams(newGrams);
    }
  };

  const handleWaterRatioChange = (value: string) => {
    setWaterRatio(value);
    const newGrams = recalculatePourGrams(coffeeAmount, value, pourGrams);
    if (newGrams !== pourGrams) {
      setPourGrams(newGrams);
    }
  };

  const handlePourChange = (index: number, field: keyof Pour, value: string | number) => {
    const newPours = [...pours];
    if (field === "description") {
      newPours[index] = { ...newPours[index], [field]: String(value) };
    }
    setPours(newPours);
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push("Method name is required");
    }

    if (pours.length === 0) {
      newErrors.push("At least one pour is required");
    }

    const totalPercentage = pours.reduce((sum, p) => sum + p.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      newErrors.push(
        `Total water amount is ${totalPercentage.toFixed(1)}%. It must equal 100% to create a valid brewing recipe.`
      );
    }

    pours.forEach((pour, i) => {
      if (pour.percentage < 0) {
        newErrors.push(`Pour ${i + 1}: percentage cannot be negative`);
      }
      if (pour.percentage > 100) {
        newErrors.push(`Pour ${i + 1}: percentage cannot exceed 100`);
      }
      if (pour.atTimeSeconds < 0) {
        newErrors.push(`Pour ${i + 1}: time cannot be negative`);
      }
    });

    // Check times are in ascending order
    for (let i = 1; i < pours.length; i++) {
      if (pours[i].atTimeSeconds < pours[i - 1].atTimeSeconds) {
        newErrors.push("Pour times must be in ascending order");
        break;
      }
    }

    if (drawdownTime < 0) {
      newErrors.push("Drawdown time cannot be negative");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setShowErrorModal(true);
      return;
    }

    const savedMethod: BrewMethod = {
      id: method?.id || generateSecureId("method"),
      name: name.trim(),
      description: description.trim(),
      category,
      drawdownTime,
      pours: pours.map((p) => ({
        percentage: p.percentage,
        atTimeSeconds: p.atTimeSeconds,
        description: p.description?.trim() || undefined,
      })),
      isDefault: false,
      isCustom: true,
    };

    onSave(savedMethod);
  };

  const gramsNumbers = pourGrams.map((g) => parseFloat(g) || 0);
  const totalWaterGrams = gramsNumbers.reduce((sum, g) => sum + g, 0);
  const coffee = parseFloat(coffeeAmount) || 0;
  const ratio = parseFloat(waterRatio) || 0;
  const expectedTotalWater = coffee * ratio;
  const totalPercentage = pours.reduce((sum, p) => sum + p.percentage, 0);
  const totalBrewTime =
    pours.length > 0 ? Math.max(...pours.map((p) => p.atTimeSeconds)) + drawdownTime : drawdownTime;

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-cream">
            {method?.id ? "Edit Method" : "Create New Method"}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
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
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this method"
              className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream placeholder-caramel/50 focus:outline-none focus:border-coffee"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cream mb-2">Category</label>
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

        {/* Coffee and Water Ratio */}
        <div className="p-4 bg-olive-dark/30 rounded-lg border border-coffee/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                Coffee Amount (grams)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={coffeeAmount}
                onChange={(e) => handleCoffeeAmountChange(e.target.value)}
                placeholder="20"
                className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream focus:outline-none focus:border-coffee"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream mb-2">Water Ratio (1:X)</label>
              <input
                type="text"
                inputMode="decimal"
                value={waterRatio}
                onChange={(e) => handleWaterRatioChange(e.target.value)}
                placeholder="15"
                className="w-full px-4 py-2 bg-olive-dark/50 border border-caramel/30 rounded-lg text-cream focus:outline-none focus:border-coffee"
              />
            </div>
          </div>
          <p className="text-xs text-caramel/70 mt-2">
            Set your coffee amount and desired ratio. Water amounts in pours will scale accordingly.
          </p>
        </div>

        {/* Summary */}
        <div className="p-4 bg-olive-dark/30 rounded-lg border border-coffee/30">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-caramel/70">Total Water:</span>
              <span
                className={`ml-2 font-semibold ${
                  totalPercentage > 100 ? "text-red-400" : "text-cream"
                }`}
              >
                {totalWaterGrams.toFixed(0)}g / {expectedTotalWater.toFixed(0)}g
              </span>
            </div>
            <div>
              <span className="text-caramel/70">Pours:</span>
              <span className="ml-2 font-semibold text-cream">{pours.length}</span>
            </div>
            <div>
              <span className="text-caramel/70">Total Time:</span>
              <span className="ml-2 font-semibold text-cream">
                {Math.floor(totalBrewTime / 60)}:{(totalBrewTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Warning message when exceeding 100% */}
          {totalPercentage > 100 && (
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
                  <p className="text-red-300 font-semibold text-sm">Total water exceeds 100%</p>
                  <p className="text-red-200 text-xs mt-1">
                    Reduce pour amounts or increase coffee amount/ratio to save this method.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pours */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-cream">Pour Schedule</label>
            <button
              onClick={handleAddPour}
              className="px-3 py-1 bg-coffee/30 hover:bg-coffee/40 text-cream rounded text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Pour
            </button>
          </div>

          <div className="space-y-3">
            {pours.map((pour, index) => (
              <div key={index} className="p-4 bg-olive-dark/30 rounded-lg border border-caramel/20">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-coffee/20 flex items-center justify-center text-cream font-semibold text-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs text-caramel/70 mb-1">Water (grams)</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={pourGrams[index]}
                          onChange={(e) => handlePourGramsChange(index, e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 bg-olive-dark/50 border border-caramel/30 rounded text-cream text-sm focus:outline-none focus:border-coffee"
                        />
                        <span className="text-xs text-caramel/50 mt-1 block">
                          {pour.percentage.toFixed(1)}%
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs text-caramel/70 mb-1">
                          Pour at time (seconds)
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={pourTimes[index]}
                          onChange={(e) => handlePourTimeChange(index, e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 bg-olive-dark/50 border border-caramel/30 rounded text-cream text-sm focus:outline-none focus:border-coffee"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-caramel/70 mb-1">Description</label>
                        <input
                          type="text"
                          value={pour.description || ""}
                          onChange={(e) => handlePourChange(index, "description", e.target.value)}
                          placeholder="Optional"
                          className="w-full px-3 py-2 bg-olive-dark/50 border border-caramel/30 rounded text-cream text-sm placeholder-caramel/50 focus:outline-none focus:border-coffee"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemovePour(index)}
                    disabled={pours.length <= 1}
                    className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors sm:self-start"
                    title="Remove pour"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
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

      {/* Validation Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Cannot Save Method"
        size="md"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-6 py-2 bg-coffee hover:bg-coffee/80 text-cream rounded-lg font-semibold transition-colors"
            >
              OK
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <svg
              className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
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
              <p className="text-red-300 font-semibold mb-2">Please fix the following issues:</p>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-200 text-sm">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BrewMethodEditor;
