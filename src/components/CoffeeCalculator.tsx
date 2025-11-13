import React from "react";
import { brewingService } from "../core/services";
import { Card, Input, Select } from "../shared/components/ui";
import type { CoffeeSettings } from "../types/coffee";

interface CoffeeCalculatorProps {
  settings: CoffeeSettings;
  onSettingsChange: (settings: CoffeeSettings) => void;
}

const CoffeeCalculator: React.FC<CoffeeCalculatorProps> = ({ settings, onSettingsChange }) => {
  const handleCoffeeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    // Prevent negative values
    const coffeeAmount = inputValue < 0 ? 0 : inputValue || 0;
    const totalWater = brewingService.calculateTotalWater(coffeeAmount, settings.waterRatio);
    onSettingsChange({ ...settings, coffeeAmount, totalWater });
  };

  const handleRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const waterRatio = parseFloat(e.target.value);
    const totalWater = brewingService.calculateTotalWater(settings.coffeeAmount, waterRatio);
    onSettingsChange({ ...settings, waterRatio, totalWater });
  };

  return (
    <Card title="Coffee Calculator">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="coffee-amount"
          type="number"
          min="0"
          step="0.5"
          value={settings.coffeeAmount || ""}
          onChange={handleCoffeeAmountChange}
          label="Coffee Amount (g)"
          placeholder="20"
          fullWidth
        />

        <Select
          id="water-ratio"
          value={settings.waterRatio}
          onChange={handleRatioChange}
          label="Water Ratio (1:X)"
          options={[
            { value: 12, label: "1:12 (Strong)" },
            { value: 13, label: "1:13" },
            { value: 14, label: "1:14" },
            { value: 15, label: "1:15" },
            { value: 16, label: "1:16 (Balanced)" },
            { value: 17, label: "1:17" },
            { value: 18, label: "1:18 (Light)" },
            { value: 19, label: "1:19" },
            { value: 20, label: "1:20 (Very Light)" },
          ]}
          fullWidth
        />
      </div>

      <div className="mt-6 p-6 bg-gradient-to-br from-coffee/30 to-coffee/10 rounded-lg shadow-inner">
        <div className="flex justify-between items-center">
          <span className="text-caramel font-medium">Total Water:</span>
          <span className="text-3xl font-bold text-cream">{settings.totalWater.toFixed(0)}g</span>
        </div>
        <div className="mt-3 text-sm text-caramel/80">
          Ratio: 1:{settings.waterRatio} ({settings.coffeeAmount}g coffee × {settings.waterRatio})
        </div>
      </div>
    </Card>
  );
};

export default CoffeeCalculator;
