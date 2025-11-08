import React, { useEffect, useState } from "react";
import { coffeeService } from "../core/services";
import { Button } from "../shared/components";
import { formatTime } from "../shared/utils";
import type { BrewStep } from "../types/coffee";

interface BrewModeProps {
  steps: BrewStep[];
  coffeeAmount: number;
  totalBrewTime: number;
  methodName?: string;
  waterTemperature?: number | null;
  selectedCoffeeId?: string | null;
  brewingMethodId?: string;
  onExit: () => void;
  onSaveSession?: () => void;
}

const BrewMode: React.FC<BrewModeProps> = ({
  steps,
  coffeeAmount,
  totalBrewTime,
  methodName,
  waterTemperature,
  selectedCoffeeId,
  onExit,
  onSaveSession,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const currentStep = steps[currentStepIndex];
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;
  const isFinished = elapsedTime >= totalBrewTime;

  // Auto-start when component mounts
  useEffect(() => {
    if (!isStarted) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;

        // Stop when we reach total brew time
        if (newTime >= totalBrewTime) {
          return totalBrewTime;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalBrewTime, isStarted]);

  // Update current step based on elapsed time
  useEffect(() => {
    // Find the correct step index based on elapsed time
    // Start from the end to prioritize later steps (like drawdown) when times match
    for (let i = steps.length - 1; i >= 0; i--) {
      if (elapsedTime >= steps[i].timeSeconds) {
        if (currentStepIndex !== i) {
          setCurrentStepIndex(i);
        }
        break;
      }
    }
  }, [elapsedTime, steps, currentStepIndex]);

  const totalWater = steps[steps.length - 1].cumulativeWater;

  return (
    <div className="bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-cream">Brew Mode</h2>
        </div>
        <button
          onClick={onExit}
          className="text-caramel hover:text-cream transition-colors"
          title="Exit Brew Mode"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Show start button before starting */}
      {!isStarted ? (
        <>
          {/* Brew Information List */}
          <div className="mb-6 p-4 bg-olive-dark/30 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-caramel/80">Method:</span>
                <span className="text-cream font-medium">{methodName || "Unknown"}</span>
              </div>
              
              {selectedCoffeeId && (
                <div className="flex justify-between">
                  <span className="text-caramel/80">Coffee:</span>
                  <span className="text-cream font-medium">
                    {(() => {
                      const coffee = coffeeService.getCoffee(selectedCoffeeId);
                      return coffee ? `${coffee.brand} - ${coffee.name}` : "Unknown";
                    })()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-caramel/80">Coffee Amount:</span>
                <span className="text-cream font-medium">{coffeeAmount}g</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-caramel/80">Water Amount:</span>
                <span className="text-cream font-medium">{totalWater.toFixed(0)}g</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-caramel/80">Water Ratio:</span>
                <span className="text-cream font-medium">1:{(totalWater / coffeeAmount).toFixed(1)}</span>
              </div>
              
              {waterTemperature && (
                <div className="flex justify-between">
                  <span className="text-caramel/80">Water Temperature:</span>
                  <span className="text-cream font-medium">{waterTemperature}°C</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-caramel/80">Steps:</span>
                <span className="text-cream font-medium">{steps.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-caramel/80">Total Time:</span>
                <span className="text-cream font-medium">{formatTime(totalBrewTime)}</span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={() => setIsStarted(true)}
            variant="primary"
            size="lg"
            fullWidth
            className="gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Start Brew
          </Button>
        </>
      ) : !isFinished ? (
        <>
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-caramel/70 mb-2">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round((elapsedTime / totalBrewTime) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-olive-dark/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-coffee to-caramel transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (elapsedTime / totalBrewTime) * 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-coffee to-coffee/70 rounded-xl flex items-center justify-center text-cream font-bold text-lg shadow-lg">
                {currentStep.stepNumber}
              </div>
              <div className="flex-1">
                <div className="text-xs text-caramel/70 mb-1">Current Step</div>
                <div className="text-base font-medium text-caramel">{currentStep.description}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 border-2 border-cream/20 rounded-lg">
                <div className="text-xs text-caramel/70 mb-2">
                  {currentStep.waterAmount > 0 ? "Pour to" : "Total Water"}
                </div>
                <div className="text-4xl font-bold text-cream">
                  {currentStep.cumulativeWater.toFixed(1)}<span className="text-2xl text-caramel/70">g</span>
                </div>
              </div>
              <div className="p-4 border-2 border-coffee/40 rounded-lg">
                <div className="text-xs text-caramel/70 mb-2">Elapsed Time</div>
                <div className="text-4xl font-bold text-coffee">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Next Step Preview */}
          {nextStep && (
            <div className="p-4 bg-olive-dark/20 rounded-lg border border-caramel/20">
              <div className="text-xs text-caramel/60 mb-2">Next Step</div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-medium text-cream">
                  {nextStep.waterAmount > 0
                    ? `Pour to ${nextStep.cumulativeWater.toFixed(1)}g`
                    : "Drawdown"}
                </span>
                <span className="text-xs text-caramel/60">at</span>
                <span className="font-mono font-medium text-coffee">{formatTime(nextStep.timeSeconds)}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mb-6 p-8 bg-gradient-to-br from-coffee/30 to-coffee/10 rounded-lg text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-coffee"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-2xl font-bold text-cream mb-2">Brew Complete!</h3>
          <p className="text-caramel mb-6">Enjoy your coffee ☕</p>
          <Button onClick={onSaveSession} variant="primary" size="lg" className="gap-2 mx-auto">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
            </svg>
            Save Session
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrewMode;
