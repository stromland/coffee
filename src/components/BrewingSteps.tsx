import React from 'react';
import type { BrewStep } from '../types/coffee';

interface BrewingStepsProps {
  steps: BrewStep[];
  coffeeAmount: number;
  totalBrewTime: number;
  methodName?: string;
  creditName?: string;
  creditUrl?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const BrewingSteps: React.FC<BrewingStepsProps> = ({ steps, coffeeAmount, totalBrewTime, methodName, creditName, creditUrl }) => {
  if (steps.length === 0) {
    return null;
  }

  const totalWater = steps.length > 0 ? steps[steps.length - 1].cumulativeWater : 0;

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg border border-coffee/30 p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-coffee rounded-full"></div>
        <h2 className="text-xl font-bold text-cream">Brewing Steps</h2>
      </div>

      {methodName && (
        <div className="mb-5 p-4 bg-olive-dark/50 rounded-lg border border-caramel/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-caramel/70 block mb-1">Method</span>
              <span className="text-sm font-semibold text-cream">{methodName}</span>
            </div>
            {creditName && creditUrl && (
              <a
                href={creditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-coffee hover:text-caramel hover:underline inline-flex items-center gap-1 bg-coffee/10 px-3 py-2 rounded-md border border-coffee/30 transition-all"
              >
                <svg
                  className="w-3 h-3"
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
                {creditName}
              </a>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-5 p-4 bg-olive-dark/50 rounded-lg border border-caramel/20">
        <p className="text-sm text-caramel">
          <span className="font-semibold text-cream">Coffee:</span> {coffeeAmount}g | 
          <span className="font-semibold text-cream ml-3">Water:</span> {totalWater.toFixed(0)}g | 
          <span className="font-semibold text-cream ml-3">Total Steps:</span> {steps.length}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative pl-20 pb-6 last:pb-0"
          >
            {index < steps.length - 1 && (
              <div className="absolute left-8 top-16 w-0.5 h-full bg-gradient-to-b from-coffee/50 to-transparent"></div>
            )}
            
            <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-coffee to-coffee/70 rounded-lg flex items-center justify-center text-cream font-bold text-xl shadow-lg border-2 border-coffee/50">
              {step.stepNumber}
            </div>
            
            <div className="bg-olive-dark/40 rounded-lg p-4 border border-caramel/20 hover:border-coffee/40 transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-cream text-base">{step.description}</h3>
                <span className="text-xl font-mono font-bold text-coffee ml-4 bg-coffee/10 px-3 py-1 rounded-md border border-coffee/30">
                  {formatTime(step.timeSeconds)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-olive/20 px-3 py-2 rounded-md border border-caramel/20">
                  <span className="text-caramel/80 text-xs block mb-1">Pour</span>
                  <span className="font-bold text-cream text-lg">
                    {step.waterAmount.toFixed(1)}g
                  </span>
                </div>
                <div className="bg-olive/20 px-3 py-2 rounded-md border border-caramel/20">
                  <span className="text-caramel/80 text-xs block mb-1">Total</span>
                  <span className="font-bold text-cream text-lg">
                    {step.cumulativeWater.toFixed(1)}g
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-coffee/20 rounded-lg border border-coffee/40">
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5 text-caramel"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-caramel">Total Brew Time:</span>
          <span className="text-xl font-mono font-bold text-cream">
            {formatTime(totalBrewTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrewingSteps;
