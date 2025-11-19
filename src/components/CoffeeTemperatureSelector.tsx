import React, { useMemo } from "react";
import { Input, Card } from "../shared/components/ui";
import { coffeeService } from "../core/services/CoffeeService";
import type { Coffee } from "../types/coffee";

interface CoffeeTemperatureSelectorProps {
  selectedCoffeeId: string | null;
  waterTemperature: number | null;
  onCoffeeChange: (coffeeId: string | null) => void;
  onTemperatureChange: (temperature: number | null) => void;
}

const CoffeeTemperatureSelector: React.FC<CoffeeTemperatureSelectorProps> = ({
  selectedCoffeeId,
  waterTemperature,
  onCoffeeChange,
  onTemperatureChange,
}) => {
  const coffees = useMemo(() => coffeeService.getAllCoffees(), []);

  // Group coffees by brand
  const coffeesByBrand = useMemo(() => {
    const grouped = new Map<string, Coffee[]>();
    coffees.forEach((coffee) => {
      const brand = coffee.brand || "Other";
      if (!grouped.has(brand)) {
        grouped.set(brand, []);
      }
      grouped.get(brand)!.push(coffee);
    });
    return grouped;
  }, [coffees]);

  return (
    <Card title="Coffee & Water Temperature">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-olive-dark dark:text-cream mb-2">Coffee</label>
          <select
            value={selectedCoffeeId || ""}
            onChange={(e) => onCoffeeChange(e.target.value || null)}
            className="w-full px-4 py-2 bg-white/80 dark:bg-olive-dark/50 border border-coffee/40 dark:border-caramel/30 rounded-lg text-olive-dark dark:text-cream placeholder-olive/50 dark:placeholder-caramel/50 focus:outline-none focus:border-coffee focus:ring-2 focus:ring-coffee/20"
          >
            <option value="">Select a coffee...</option>
            {Array.from(coffeesByBrand.entries()).map(([brand, brandCoffees]) => [
              <optgroup key={`group-${brand}`} label={brand}>
                {brandCoffees.map((coffee) => (
                  <option key={coffee.id} value={coffee.id}>
                    {coffee.brand} - {coffee.name}
                  </option>
                ))}
              </optgroup>,
            ])}
          </select>
          {selectedCoffeeId && coffeeService.getCoffee(selectedCoffeeId) && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-coffee/20 text-coffee border border-coffee/40 capitalize">
                  {coffeeService.getCoffee(selectedCoffeeId)!.roast}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-white/60 dark:bg-olive/30 text-olive dark:text-caramel border border-coffee/40 dark:border-caramel/40 capitalize">
                  {coffeeService.getCoffee(selectedCoffeeId)!.type}
                </span>
              </div>
              {coffeeService.getCoffee(selectedCoffeeId)?.description && (
                <p className="text-xs text-caramel/70">
                  {coffeeService.getCoffee(selectedCoffeeId)?.description}
                </p>
              )}
            </div>
          )}
        </div>

        <Input
          id="water-temperature"
          type="number"
          min="60"
          max="100"
          step="1"
          value={waterTemperature?.toString() || ""}
          onChange={(e) => onTemperatureChange(e.target.value ? parseFloat(e.target.value) : null)}
          label="Water Temperature (°C)"
          placeholder="93"
          fullWidth
        />
      </div>
    </Card>
  );
};

export default CoffeeTemperatureSelector;
