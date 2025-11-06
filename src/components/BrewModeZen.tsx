import React, { useEffect, useState } from "react";
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

const BrewModeZen: React.FC<BrewModeProps> = ({
  steps,
  totalBrewTime,
  methodName,
  onExit,
  onSaveSession,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [showUI, setShowUI] = useState(true);

  const currentStep = steps[currentStepIndex];
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFinished = elapsedTime >= totalBrewTime;

  // Calculate time until next pour
  const timeUntilNextPour = nextStep
    ? nextStep.timeSeconds - elapsedTime
    : totalBrewTime - elapsedTime;

  // Calculate progress percentage
  const progressPercent = Math.min(100, (elapsedTime / totalBrewTime) * 100);

  // Handle UI fade out after 3 seconds of no interaction
  useEffect(() => {
    if (!isStarted || isFinished) {
      setShowUI(true);
      return;
    }

    // Set new timeout to hide UI
    const timeout = setTimeout(() => {
      setShowUI(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isStarted, isFinished, showUI]);

  // Show UI on any mouse movement
  const handleMouseMove = () => {
    if (!showUI && isStarted && !isFinished) {
      setShowUI(true);
    }
  };

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

  // Calculate circle properties for progress ring
  const circleRadius = 140;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference - (progressPercent / 100) * circleCircumference;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Close button - always visible */}
      <button
        onClick={onExit}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-500 ${
          showUI || !isStarted || isFinished ? 'opacity-100' : 'opacity-0'
        }`}
        title="Exit Brew Mode"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Main content */}
      <div className="w-full max-w-2xl relative">
        {!isStarted ? (
          /* Start screen */
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-light text-gray-700 mb-12">{methodName || "Brew Method"}</h2>
            
            <button
              onClick={() => setIsStarted(true)}
              className="group relative w-32 h-32 mx-auto mb-12 transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg" />
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </button>

            <p className="text-sm text-gray-500 font-light">
              {steps.length} steps · {formatTime(totalBrewTime)}
            </p>
          </div>
        ) : isFinished ? (
          /* Completion screen */
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-gray-600 animate-pulse-slow"
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
            
            <h3 className="text-3xl font-light text-gray-800 mb-3">Complete</h3>
            <p className="text-gray-500 mb-12 font-light">Enjoy your coffee</p>
            
            <button
              onClick={onSaveSession}
              className="px-8 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all text-gray-700 font-light shadow-md hover:shadow-lg"
            >
              Save Session
            </button>
          </div>
        ) : (
          /* Brewing screen */
          <div className="text-center relative">
            {/* Circular progress ring */}
            <div className="relative inline-block mb-8">
              <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 320 320">
                {/* Background circle */}
                <circle
                  cx="160"
                  cy="160"
                  r={circleRadius}
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="160"
                  cy="160"
                  r={circleRadius}
                  stroke="#9ca3af"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={circleOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              
              {/* Timer in center with breathing animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-breathe">
                  <div className="text-7xl font-extralight text-gray-800 tracking-tight">
                    {formatTime(timeUntilNextPour > 0 ? timeUntilNextPour : 0)}
                  </div>
                  <div className={`text-sm font-light mt-2 transition-opacity duration-500 ${
                    showUI ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <span className="text-gray-500">
                      {!isLastStep && timeUntilNextPour > 0 ? "until next pour" : isLastStep && timeUntilNextPour > 0 ? "remaining" : "step time"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step instruction - fades in from bottom */}
            <div className={`transition-all duration-700 ${
              showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-sm">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-sm font-medium">
                  {currentStep.stepNumber}
                </div>
                <span className="text-gray-700 font-light">{currentStep.description}</span>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full">
                  <span className="text-gray-500 font-light">Pour to </span>
                  <span className="text-gray-800 font-medium">{currentStep.cumulativeWater.toFixed(0)}g</span>
                </div>
                <div className="px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full">
                  <span className="text-gray-500 font-light">Step </span>
                  <span className="text-gray-800 font-medium">{currentStepIndex + 1}/{steps.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BrewModeZen;
