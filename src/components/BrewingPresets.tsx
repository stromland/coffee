import React from 'react';
import { brewMethods } from '../utils/coffeeCalculations';

interface BrewingPresetsProps {
  selectedMethodId: string;
  onMethodChange: (methodId: string) => void;
}

const BrewingPresets: React.FC<BrewingPresetsProps> = ({ selectedMethodId, onMethodChange }) => {
  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg border border-coffee/30 p-6 shadow-2xl h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-coffee rounded-full"></div>
        <h2 className="text-xl font-bold text-cream">Brewing Method</h2>
      </div>
      
      <div className="space-y-3">
        {brewMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodChange(method.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedMethodId === method.id
                ? 'border-coffee bg-coffee/20 shadow-lg'
                : 'border-caramel/20 hover:border-coffee/50 bg-olive-dark/30 hover:bg-olive-dark/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-base text-cream">{method.name}</h3>
                <p className="text-xs text-caramel/80 mt-1 leading-relaxed">{method.description}</p>
              </div>
              {selectedMethodId === method.id && (
                <div className="ml-3 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-coffee"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrewingPresets;
