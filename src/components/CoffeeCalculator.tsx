import React from "react";
import type { CoffeeSettings } from "../types/coffee";
import { calculateTotalWater } from "../utils/coffeeCalculations";

interface CoffeeCalculatorProps {
  settings: CoffeeSettings;
  onSettingsChange: (settings: CoffeeSettings) => void;
}

const CoffeeCalculator: React.FC<CoffeeCalculatorProps> = ({
  settings,
  onSettingsChange,
}) => {
  const handleCoffeeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const coffeeAmount = parseFloat(e.target.value) || 0;
    const totalWater = calculateTotalWater(coffeeAmount, settings.waterRatio);
    onSettingsChange({ ...settings, coffeeAmount, totalWater });
  };

  const handleRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const waterRatio = parseFloat(e.target.value);
    const totalWater = calculateTotalWater(settings.coffeeAmount, waterRatio);
    onSettingsChange({ ...settings, waterRatio, totalWater });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-olive/20">
      <h2 className="text-2xl font-bold text-olive-dark mb-4">
        Coffee Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="coffee-amount"
            className="block text-sm font-medium text-olive-dark mb-2"
          >
            Coffee Amount (g)
          </label>
          <input
            id="coffee-amount"
            type="number"
            min="1"
            step="0.5"
            value={settings.coffeeAmount || ""}
            onChange={handleCoffeeAmountChange}
            className="w-full px-4 py-2 border border-olive/30 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent bg-white"
            placeholder="20"
          />
        </div>

        <div>
          <label
            htmlFor="water-ratio"
            className="block text-sm font-medium text-olive-dark mb-2"
          >
            Water Ratio (1:X)
          </label>
          <select
            id="water-ratio"
            value={settings.waterRatio}
            onChange={handleRatioChange}
            className="w-full px-4 py-2 border border-olive/30 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent bg-white"
          >
            <option value={12}>1:12 (Strong)</option>
            <option value={13}>1:13</option>
            <option value={14}>1:14</option>
            <option value={15}>1:15 (Balanced)</option>
            <option value={16}>1:16</option>
            <option value={17}>1:17 (Light)</option>
            <option value={18}>1:18</option>
            <option value={19}>1:19</option>
            <option value={20}>1:20 (Very Light)</option>
          </select>
        </div>
      </div>

      <div className="mt-6 p-4 bg-coffee/10 rounded-md border border-coffee/20">
        <div className="flex justify-between items-center">
          <span className="text-olive-dark font-medium">Total Water:</span>
          <span className="text-2xl font-bold text-coffee">
            {settings.totalWater.toFixed(0)}g
          </span>
        </div>
        <div className="mt-2 text-sm text-olive">
          Ratio: 1:{settings.waterRatio} ({settings.coffeeAmount}g coffee ×{" "}
          {settings.waterRatio})
        </div>
      </div>
    </div>
  );
};

export default CoffeeCalculator;
