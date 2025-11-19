import React, { useState } from "react";
import type { BrewingSession } from "../types/coffee";
import { sessionService, coffeeService } from "../core/services";
import { generateSecureId } from "../shared/utils/idGenerator";
import { Card, Input, Button } from "../shared/components/ui";

interface SaveSessionFormProps {
  coffeeAmount: number;
  waterAmount: number;
  brewingMethodId: string;
  brewingMethodName: string;
  brewTime?: number;
  waterTemperature?: number | null;
  selectedCoffeeId?: string | null;
  onSave: () => void;
  onCancel?: () => void;
}

const SaveSessionForm: React.FC<SaveSessionFormProps> = ({
  coffeeAmount,
  waterAmount,
  brewingMethodId,
  brewingMethodName,
  brewTime,
  waterTemperature: initialWaterTemperature,
  selectedCoffeeId,
  onSave,
  onCancel,
}) => {
  const [coffeeType, setCoffeeType] = useState("");
  const [waterTemperature, setWaterTemperature] = useState(
    initialWaterTemperature?.toString() || ""
  );
  const [grindSize, setGrindSize] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [ratingTouched, setRatingTouched] = useState(false);

  // Get coffee name if selected
  let selectedCoffeeName = "";
  if (selectedCoffeeId) {
    const coffee = coffeeService.getCoffee(selectedCoffeeId);
    if (coffee) {
      selectedCoffeeName = `${coffee.brand} - ${coffee.name}`;
    }
  }

  const handleSave = () => {
    if (!selectedCoffeeId && !coffeeType.trim()) return;
    if (!rating) {
      setRatingTouched(true);
      return;
    }

    const coffeeName = selectedCoffeeName || coffeeType;

    const session: BrewingSession = {
      id: generateSecureId("session"),
      timestamp: Date.now(),
      coffeeType: coffeeName || "Unknown",
      coffeeId: selectedCoffeeId || undefined,
      brewingMethod: brewingMethodId,
      coffeeAmount,
      waterAmount,
      waterTemperature: waterTemperature ? parseFloat(waterTemperature) : undefined,
      brewTime,
      grindSize: grindSize || undefined,
      rating,
      notes: notes || undefined,
    };

    sessionService.saveSession(session);
    onSave();

    // Reset form
    setCoffeeType("");
    setWaterTemperature("");
    setGrindSize("");
    setRating(undefined);
    setRatingTouched(false);
    setNotes("");
  };

  return (
    <Card title="Save Brewing Session">
      <div className="space-y-4 mb-6">
        {/* Auto-filled info */}
        <div className="p-4 bg-coffee/10 rounded-lg border border-coffee/30">
          <p className="text-sm text-olive dark:text-caramel mb-2">
            <span className="font-semibold text-olive-dark dark:text-cream">Method:</span> {brewingMethodName}
          </p>
          {selectedCoffeeName && (
            <p className="text-sm text-olive dark:text-caramel mb-2">
              <span className="font-semibold text-olive-dark dark:text-cream">Coffee Type:</span> {selectedCoffeeName}
            </p>
          )}
          <p className="text-sm text-olive dark:text-caramel mb-2">
            <span className="font-semibold text-olive-dark dark:text-cream">Coffee:</span> {coffeeAmount}g
          </p>
          <p className="text-sm text-olive dark:text-caramel mb-2">
            <span className="font-semibold text-olive-dark dark:text-cream">Water:</span> {waterAmount}g
          </p>
          {waterTemperature && (
            <p className="text-sm text-olive dark:text-caramel mb-2">
              <span className="font-semibold text-olive-dark dark:text-cream">Temperature:</span> {waterTemperature}°C
            </p>
          )}
          {brewTime && (
            <p className="text-sm text-olive dark:text-caramel">
              <span className="font-semibold text-olive-dark dark:text-cream">Brew Time:</span>{" "}
              {Math.floor(brewTime / 60)}:{(brewTime % 60).toString().padStart(2, "0")}
            </p>
          )}
        </div>

        {!selectedCoffeeId && (
          <Input
            id="coffee-type"
            type="text"
            value={coffeeType}
            onChange={(e) => setCoffeeType(e.target.value)}
            label={
              <>
                Coffee Type / Beans <span className="text-coffee">*</span>
              </>
            }
            placeholder="e.g., Ethiopian Yirgacheffe"
            fullWidth
          />
        )}

        {!initialWaterTemperature && (
          <Input
            id="water-temp"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={waterTemperature}
            onChange={(e) => setWaterTemperature(e.target.value)}
            label={
              <>
                Water Temperature (°C) <span className="text-caramel/50 text-xs">- optional</span>
              </>
            }
            placeholder="e.g., 92"
            fullWidth
          />
        )}

        <Input
          id="grind-size"
          type="text"
          value={grindSize}
          onChange={(e) => setGrindSize(e.target.value)}
          label={
            <>
              Grind Size <span className="text-caramel/50 text-xs">- optional</span>
            </>
          }
          placeholder="e.g., Medium-Fine, 15 clicks"
          fullWidth
        />

        {/* Rating - Required */}
        <div>
          <label className="block text-sm font-medium text-olive dark:text-caramel mb-2">
            Rating <span className="text-coffee">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setRating(value);
                  setRatingTouched(true);
                }}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  rating && rating >= value
                    ? "border-coffee bg-coffee/20 text-coffee"
                    : "border-coffee/40 dark:border-caramel/30 hover:border-coffee/50 text-caramel/50"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {ratingTouched && !rating && (
            <p className="text-red-400 text-xs mt-1">Please select a rating</p>
          )}
        </div>

        {/* Notes - Optional */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-olive dark:text-caramel mb-2">
            Tasting Notes <span className="text-caramel/50 text-xs">- optional</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-coffee/40 rounded-md focus:ring-2 focus:ring-coffee focus:border-coffee bg-white/60 dark:bg-olive/20 text-olive-dark dark:text-cream placeholder-olive/50 dark:placeholder-caramel/50 resize-none"
            placeholder="Notes about the taste, aroma, body, acidity..."
          />
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <Button onClick={onCancel} variant="ghost" fullWidth>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={(!selectedCoffeeId && !coffeeType.trim()) || !rating}
          fullWidth
        >
          Save Session
        </Button>
      </div>
    </Card>
  );
};

export default SaveSessionForm;
