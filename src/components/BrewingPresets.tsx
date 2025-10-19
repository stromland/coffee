import React from 'react';
import { brewMethods } from '../utils/coffeeCalculations';

interface BrewingPresetsProps {
  selectedMethodId: string;
  onMethodChange: (methodId: string) => void;
}

const BrewingPresets: React.FC<BrewingPresetsProps> = ({ selectedMethodId, onMethodChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-olive/20">
      <h2 className="text-2xl font-bold text-olive-dark mb-4">Brewing Method</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {brewMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodChange(method.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedMethodId === method.id
                ? 'border-olive bg-olive/10'
                : 'border-caramel/30 hover:border-olive/50 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-olive-dark">{method.name}</h3>
                <p className="text-sm text-olive mt-1">{method.description}</p>
                {method.creditName && method.creditUrl && (
                  <div className="mt-2">
                    <a
                      href={method.creditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-coffee hover:text-coffee/80 hover:underline inline-flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {method.creditName}
                    </a>
                  </div>
                )}
              </div>
              {selectedMethodId === method.id && (
                <div className="ml-4">
                  <svg
                    className="w-6 h-6 text-olive"
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
