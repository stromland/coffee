import React, { useState } from 'react';
import type { BrewingSession } from '../types/coffee';
import { saveSession } from '../utils/sessionStorage';

interface SaveSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  coffeeAmount: number;
  waterAmount: number;
  brewingMethodId: string;
  brewingMethodName: string;
  brewTime?: number;
}

const SaveSessionDialog: React.FC<SaveSessionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  coffeeAmount,
  waterAmount,
  brewingMethodId,
  brewingMethodName,
  brewTime,
}) => {
  const [coffeeType, setCoffeeType] = useState('');
  const [waterTemperature, setWaterTemperature] = useState('');
  const [grindSize, setGrindSize] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const session: BrewingSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now(),
      coffeeType: coffeeType || 'Unknown',
      brewingMethod: brewingMethodId,
      coffeeAmount,
      waterAmount,
      waterTemperature: waterTemperature ? parseFloat(waterTemperature) : undefined,
      brewTime,
      grindSize: grindSize || undefined,
      rating,
      notes: notes || undefined,
    };

    saveSession(session);
    onSave();
    
    // Reset form
    setCoffeeType('');
    setWaterTemperature('');
    setGrindSize('');
    setRating(undefined);
    setNotes('');
  };

  const handleClose = () => {
    // Reset form
    setCoffeeType('');
    setWaterTemperature('');
    setGrindSize('');
    setRating(undefined);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-olive-dark rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-cream">Save Brewing Session</h2>
            <button
              onClick={handleClose}
              className="text-caramel hover:text-cream transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

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

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-olive/20 hover:bg-olive/30 text-caramel hover:text-cream rounded-lg transition-all border border-caramel/30"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!coffeeType.trim()}
              className="flex-1 px-4 py-3 bg-coffee hover:bg-coffee/80 text-cream rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Save Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSessionDialog;
