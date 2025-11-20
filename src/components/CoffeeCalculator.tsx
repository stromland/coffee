import React from "react";
import type { CoffeeSettings } from "../types/coffee";
import { brewingService } from "../core/services";
import { Input, Select, Card } from "../shared/components/ui";

interface CoffeeCalculatorProps {
  settings: CoffeeSettings;
  onSettingsChange: (settings: CoffeeSettings) => void;
}

const CoffeeCalculator: React.FC<CoffeeCalculatorProps> = ({ settings, onSettingsChange }) => {
  const handleCoffeeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const coffeeAmount = parseFloat(e.target.value) || 0;
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
          min="1"
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
            { value: 15, label: "1:15 (Balanced)" },
            { value: 16, label: "1:16" },
            { value: 17, label: "1:17 (Light)" },
            { value: 18, label: "1:18" },
            { value: 19, label: "1:19" },
            { value: 20, label: "1:20 (Very Light)" },
          ]}
          fullWidth
        />
      </div>

      <div className="mt-6 p-6 bg-gradient-to-br from-coffee/30 to-coffee/10 rounded-lg shadow-inner">
        <div className="flex justify-between items-center">
          <span className="text-olive dark:text-caramel font-medium">Total Water:</span>
          <span className="text-3xl font-bold text-olive-dark dark:text-cream">{settings.totalWater.toFixed(0)}g</span>
        </div>
        <div className="mt-3 text-sm text-caramel/80">
          Ratio: 1:{settings.waterRatio} ({settings.coffeeAmount}g coffee × {settings.waterRatio})
        </div>
      </div>
    </Card>
  );
};

export default CoffeeCalculator;
