import React, { useState } from 'react';
import type { BrewingSession } from '../types/coffee';
import { sessionService } from '../core/services';
import { generateSecureId } from '../shared/utils/idGenerator';

interface SaveSessionFormProps {
  coffeeAmount: number;
  waterAmount: number;
  brewingMethodId: string;
  brewingMethodName: string;
  brewingPresetId?: string;
  brewingPresetName?: string;
  brewTime?: number;
  onSave: () => void;
}

const SaveSessionForm: React.FC<SaveSessionFormProps> = ({
  coffeeAmount,
  waterAmount,
  brewingMethodId,
  brewingMethodName,
  brewingPresetId,
  brewingPresetName,
  brewTime,
  onSave,
}) => {
  const [coffeeType, setCoffeeType] = useState('');
  const [waterTemperature, setWaterTemperature] = useState('');
  const [grindSize, setGrindSize] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!coffeeType.trim()) return;

    const session: BrewingSession = {
      id: generateSecureId('session'),
      timestamp: Date.now(),
      coffeeType: coffeeType || 'Unknown',
      brewingMethod: brewingMethodId,
      brewingPreset: brewingPresetId,
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
    setCoffeeType('');
    setWaterTemperature('');
    setGrindSize('');
    setRating(undefined);
    setNotes('');
  };

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-coffee rounded-full"></div>
        <h2 className="text-xl font-bold text-cream">Save Brewing Session</h2>
      </div>

      <div className="space-y-4 mb-6">
        {/* Auto-filled info */}
        <div className="p-4 bg-coffee/10 rounded-lg border border-coffee/30">
          <p className="text-sm text-caramel mb-2">
            <span className="font-semibold text-cream">Method:</span> {brewingMethodName}
            {brewingPresetName && <span className="text-caramel/70"> ({brewingPresetName})</span>}
          </p>
          <p className="text-sm text-caramel mb-2">
            <span className="font-semibold text-cream">Coffee:</span> {coffeeAmount}g
          </p>
          <p className="text-sm text-caramel mb-2">
            <span className="font-semibold text-cream">Water:</span> {waterAmount}g
          </p>
          {brewTime && (
            <p className="text-sm text-caramel">
              <span className="font-semibold text-cream">Brew Time:</span> {Math.floor(brewTime / 60)}:{(brewTime % 60).toString().padStart(2, '0')}
            </p>
          )}
        </div>

        {/* Coffee Type - Required */}
        <div>
          <label htmlFor="coffee-type" className="block text-sm font-medium text-caramel mb-2">
            Coffee Type / Beans <span className="text-coffee">*</span>
          </label>
          <input
            id="coffee-type"
            type="text"
            value={coffeeType}
            onChange={(e) => setCoffeeType(e.target.value)}
            className="w-full px-4 py-2 border border-coffee/40 rounded-md focus:ring-2 focus:ring-coffee focus:border-coffee bg-olive/20 text-cream placeholder-caramel/50"
            placeholder="e.g., Ethiopian Yirgacheffe"
          />
        </div>

        {/* Water Temperature - Optional */}
        <div>
          <label htmlFor="water-temp" className="block text-sm font-medium text-caramel mb-2">
            Water Temperature (°C) <span className="text-caramel/50 text-xs">- optional</span>
          </label>
          <input
            id="water-temp"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={waterTemperature}
            onChange={(e) => setWaterTemperature(e.target.value)}
            className="w-full px-4 py-2 border border-coffee/40 rounded-md focus:ring-2 focus:ring-coffee focus:border-coffee bg-olive/20 text-cream placeholder-caramel/50"
            placeholder="e.g., 92"
          />
        </div>

        {/* Grind Size - Optional */}
        <div>
          <label htmlFor="grind-size" className="block text-sm font-medium text-caramel mb-2">
            Grind Size <span className="text-caramel/50 text-xs">- optional</span>
          </label>
          <input
            id="grind-size"
            type="text"
            value={grindSize}
            onChange={(e) => setGrindSize(e.target.value)}
            className="w-full px-4 py-2 border border-coffee/40 rounded-md focus:ring-2 focus:ring-coffee focus:border-coffee bg-olive/20 text-cream placeholder-caramel/50"
            placeholder="e.g., Medium-Fine, 15 clicks"
          />
        </div>

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
                    ? 'border-coffee bg-coffee/20 text-coffee'
                    : 'border-caramel/30 hover:border-coffee/50 text-caramel/50'
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

      <button
        onClick={handleSave}
        disabled={!coffeeType.trim()}
        className="w-full px-4 py-3 bg-coffee hover:bg-coffee/80 text-cream rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        Save Session
      </button>
    </div>
  );
};

export default SaveSessionForm;
