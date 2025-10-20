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
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-coffee rounded-full"></div>
        <h2 className="text-xl font-bold text-cream">
          Coffee Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="coffee-amount"
            className="block text-sm font-medium text-caramel mb-2"
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
            className="w-full px-4 py-3 border border-coffee/40 rounded-md focus:ring-2 focus:ring-coffee focus:border-coffee bg-olive-dark/50 text-cream placeholder-caramel/50 transition-all"
            placeholder="20"
          />
        </div>

        <div>
          <label
            htmlFor="water-ratio"
            className="block text-sm font-medium text-caramel mb-2"
          >
            Water Ratio (1:X)
          </label>
          <select
            id="water-ratio"
            value={settings.waterRatio}
            onChange={handleRatioChange}
            className="w-full px-4 py-3 border border-coffee/40 rounded-md focus:ring-2 focus:ring-coffee focus:border-coffee bg-olive-dark/50 text-cream transition-all"
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

      <div className="mt-6 p-6 bg-gradient-to-br from-coffee/30 to-coffee/10 rounded-lg shadow-inner">
        <div className="flex justify-between items-center">
          <span className="text-caramel font-medium">Total Water:</span>
          <span className="text-3xl font-bold text-cream">
            {settings.totalWater.toFixed(0)}g
          </span>
        </div>
        <div className="mt-3 text-sm text-caramel/80">
          Ratio: 1:{settings.waterRatio} ({settings.coffeeAmount}g coffee ×{" "}
          {settings.waterRatio})
        </div>
      </div>
    </div>
  );
};

export default CoffeeCalculator;
