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
          <div className="mb-0 flex flex-col items-center justify-center">
            <Button
              onClick={() => setIsStarted(true)}
              variant="primary"
              size="lg"
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
          </div>
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
          <div className="mb-6 p-6 bg-olive-dark/50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-coffee to-coffee/70 rounded-lg flex items-center justify-center text-cream font-bold text-xl shadow-lg">
                  {currentStep.stepNumber}
                </div>
                <div>
                  <div className="text-xs text-caramel/70">Current Step</div>
                  <div className="text-lg font-semibold text-cream">{currentStep.description}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-olive/20 rounded-md">
                <span className="text-caramel/80 text-xs block mb-1">
                  {currentStep.waterAmount > 0 ? "Pour to" : "Total Water"}
                </span>
                <span className="font-bold text-cream text-2xl">
                  {currentStep.cumulativeWater.toFixed(1)}g
                </span>
              </div>
              <div className="p-3 bg-coffee/20 border border-coffee/40 rounded-md">
                <span className="text-caramel/80 text-xs block mb-1">Elapsed Time</span>
                <span className="font-bold text-coffee text-2xl">{formatTime(elapsedTime)}</span>
              </div>
            </div>
          </div>

          {/* Next Step Preview */}
          {nextStep && (
            <div className="mb-6 p-4 bg-olive-dark/30 rounded-lg border border-coffee/30">
              <div className="text-xs text-caramel/70 mb-2">Next Step</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-coffee/50 to-coffee/30 rounded-lg flex items-center justify-center text-cream font-bold text-sm shadow-lg">
                    {nextStep.stepNumber}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-cream">{nextStep.description}</div>
                    <div className="text-xs text-caramel/80">
                      {nextStep.waterAmount > 0
                        ? `Pour to ${nextStep.cumulativeWater.toFixed(1)}g`
                        : "Wait for brew to complete"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-caramel/70">At</div>
                  <div className="text-lg font-mono font-bold text-coffee">
                    {formatTime(nextStep.timeSeconds)}
                  </div>
                </div>
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
