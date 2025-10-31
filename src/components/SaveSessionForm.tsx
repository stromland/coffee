import React, { useState } from "react";
import type { BrewingSession } from "../types/coffee";
import { sessionService } from "../core/services";
import { generateSecureId } from "../shared/utils/idGenerator";
import { Card, Input, Button } from "../shared/components/ui";

interface SaveSessionFormProps {
  coffeeAmount: number;
  waterAmount: number;
  brewingMethodId: string;
  brewingMethodName: string;
  brewTime?: number;
  onSave: () => void;
}

const SaveSessionForm: React.FC<SaveSessionFormProps> = ({
  coffeeAmount,
  waterAmount,
  brewingMethodId,
  brewingMethodName,
  brewTime,
  onSave,
}) => {
  const [coffeeType, setCoffeeType] = useState("");
  const [waterTemperature, setWaterTemperature] = useState("");
  const [grindSize, setGrindSize] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!coffeeType.trim()) return;

    // Note: The brewingPreset field was removed from BrewingSession as presets
    // are now unified with methods. Legacy sessions with brewingPreset field
    // will continue to work as the field is simply ignored when loading.
    const session: BrewingSession = {
      id: generateSecureId("session"),
      timestamp: Date.now(),
      coffeeType: coffeeType || "Unknown",
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
    setNotes("");
  };

  return (
    <Card title="Save Brewing Session">
      <div className="space-y-4 mb-6">
        {/* Auto-filled info */}
        <div className="p-4 bg-coffee/10 rounded-lg border border-coffee/30">
          <p className="text-sm text-caramel mb-2">
            <span className="font-semibold text-cream">Method:</span> {brewingMethodName}
          </p>
          <p className="text-sm text-caramel mb-2">
            <span className="font-semibold text-cream">Coffee:</span> {coffeeAmount}g
          </p>
          <p className="text-sm text-caramel mb-2">
            <span className="font-semibold text-cream">Water:</span> {waterAmount}g
          </p>
          {brewTime && (
            <p className="text-sm text-caramel">
              <span className="font-semibold text-cream">Brew Time:</span>{" "}
              {Math.floor(brewTime / 60)}:{(brewTime % 60).toString().padStart(2, "0")}
            </p>
          )}
        </div>

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

        {/* Rating - Optional */}
        <div>
          <label className="block text-sm font-medium text-caramel mb-2">
            Rating <span className="text-caramel/50 text-xs">- optional</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(rating === value ? undefined : value)}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  rating && rating >= value
                    ? "border-coffee bg-coffee/20 text-coffee"
                    : "border-caramel/30 hover:border-coffee/50 text-caramel/50"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Notes - Optional */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-caramel mb-2">
            Tasting Notes <span className="text-caramel/50 text-xs">- optional</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-coffee/40 rounded-md focus:ring-2 focus:ring-coffee focus:border-coffee bg-olive/20 text-cream placeholder-caramel/50 resize-none"
            placeholder="Notes about the taste, aroma, body, acidity..."
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={!coffeeType.trim()} fullWidth>
        Save Session
      </Button>
    </Card>
  );
};

export default SaveSessionForm;
