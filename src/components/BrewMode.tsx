import React, { useEffect, useState } from "react";
import type { BrewStep } from "../types/coffee";
import { formatTime } from "../shared/utils";

interface BrewModeProps {
  steps: BrewStep[];
  coffeeAmount: number;
  totalBrewTime: number;
  methodName?: string;
  onExit: () => void;
}

const BrewMode: React.FC<BrewModeProps> = ({
  steps,
  coffeeAmount,
  totalBrewTime,
  methodName,
  onExit,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const currentStep = steps[currentStepIndex];
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFinished = elapsedTime >= totalBrewTime;

  // Calculate time until next pour
  const timeUntilNextPour = nextStep
    ? nextStep.timeSeconds - elapsedTime
    : totalBrewTime - elapsedTime;

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

      {/* Info Header */}
      <div className="mb-5 p-3 bg-olive-dark/30 rounded-lg">
        <p className="text-xs text-caramel text-center">
          <span className="font-semibold text-cream">Method:</span> {methodName || "Unknown"}
        </p>
      </div>

      {/* Show start button before starting */}
      {!isStarted ? (
        <div className="mb-6 p-6 bg-olive-dark/50 rounded-lg flex flex-col items-center justify-center">
          <button
            onClick={() => setIsStarted(true)}
            className="px-8 py-6 bg-coffee/30 hover:bg-coffee/40 border-2 border-coffee/50 rounded-xl transition-all flex flex-col items-center justify-center gap-2 hover:scale-105"
          >
            <svg className="w-12 h-12 text-cream" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-cream font-bold text-xl">Start Brew</span>
          </button>
          <p className="text-caramel text-sm mt-4">
            {steps.length} steps • {formatTime(totalBrewTime)} total time
          </p>
        </div>
      ) : !isFinished ? (
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
              <span className="text-caramel/80 text-xs block mb-1">Pour to</span>
              <span className="font-bold text-cream text-2xl">
                {currentStep.cumulativeWater.toFixed(1)}g
              </span>
            </div>
            {!isLastStep && timeUntilNextPour > 0 ? (
              <div className="p-3 bg-coffee/20 border border-coffee/40 rounded-md">
                <span className="text-caramel/80 text-xs block mb-1">Next pour in</span>
                <span className="font-bold text-coffee text-2xl">
                  {formatTime(Math.max(0, timeUntilNextPour))}
                </span>
              </div>
            ) : isLastStep && timeUntilNextPour > 0 ? (
              <div className="p-3 bg-coffee/20 border border-coffee/40 rounded-md">
                <span className="text-caramel/80 text-xs block mb-1">Brew finishes in</span>
                <span className="font-bold text-coffee text-2xl">
                  {formatTime(Math.max(0, timeUntilNextPour))}
                </span>
              </div>
            ) : (
              <div className="p-3 bg-olive/20 rounded-md">
                <span className="text-caramel/80 text-xs block mb-1">Step Time</span>
                <span className="font-bold text-cream text-2xl">
                  {formatTime(currentStep.timeSeconds)}
                </span>
              </div>
            )}
          </div>
        </div>
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
          <p className="text-caramel">Enjoy your coffee ☕</p>
        </div>
      )}

      {/* Info Footer */}
      <div className="p-3 bg-olive-dark/30 rounded-lg">
        <p className="text-xs text-caramel text-center">
          <span className="font-semibold text-cream">Coffee:</span> {coffeeAmount}g |{" "}
          <span className="font-semibold text-cream">Water:</span> {totalWater.toFixed(0)}g |{" "}
          <span className="font-semibold text-cream">Total Time:</span> {formatTime(totalBrewTime)}
        </p>
      </div>
    </div>
  );
};

export default BrewMode;
