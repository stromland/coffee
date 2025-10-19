import React from 'react';
import type { BrewStep } from '../types/coffee';

interface BrewingStepsProps {
  steps: BrewStep[];
  coffeeAmount: number;
  totalBrewTime: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const BrewingSteps: React.FC<BrewingStepsProps> = ({ steps, coffeeAmount, totalBrewTime }) => {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-olive/20">
      <h2 className="text-2xl font-bold text-olive-dark mb-4">Brewing Steps</h2>
      
      <div className="mb-4 p-4 bg-caramel/20 rounded-md border border-caramel/30">
        <p className="text-sm text-olive-dark">
          <span className="font-semibold">Coffee:</span> {coffeeAmount}g | 
          <span className="font-semibold ml-2">Total Steps:</span> {steps.length}
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start p-4 border-l-4 border-coffee bg-caramel/10 rounded-r-lg"
          >
            <div className="flex-shrink-0 w-16 h-16 bg-coffee rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
              {step.stepNumber}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-olive-dark">{step.description}</h3>
                <span className="text-lg font-mono font-bold text-coffee ml-4">
                  {formatTime(step.timeSeconds)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-olive">Pour: </span>
                  <span className="font-semibold text-olive-dark">
                    {step.waterAmount.toFixed(1)}g
                  </span>
                </div>
                <div>
                  <span className="text-olive">Total: </span>
                  <span className="font-semibold text-olive-dark">
                    {step.cumulativeWater.toFixed(1)}g
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-olive/10 rounded-md border border-olive/30">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-olive mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-olive-dark">
            Estimated total brew time: {formatTime(totalBrewTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrewingSteps;
