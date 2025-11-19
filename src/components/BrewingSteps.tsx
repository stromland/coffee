import React, { useState } from "react";
import { createPortal } from "react-dom";
import { coffeeService } from "../core/services";
import { Button, Section } from "../shared/components";
import { formatTime } from "../shared/utils";
import type { BrewStep } from "../types/coffee";
import BrewMode from "./BrewMode";
import SaveSessionForm from "./SaveSessionForm";

interface BrewingStepsProps {
  steps: BrewStep[];
  coffeeAmount: number;
  totalBrewTime: number;
  methodName?: string;
  creditName?: string;
  creditUrl?: string;
  brewingMethodId?: string;
  waterTemperature?: number | null;
  selectedCoffeeId?: string | null;
  onSessionSaved?: () => void;
  onBrewModeExit?: () => void;
}

const BrewingSteps: React.FC<BrewingStepsProps> = ({
  steps,
  coffeeAmount,
  totalBrewTime,
  methodName,
  creditName,
  creditUrl,
  brewingMethodId = "unknown",
  waterTemperature,
  selectedCoffeeId,
  onSessionSaved,
  onBrewModeExit,
}) => {
  const [isBrewMode, setIsBrewMode] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSaveSession = () => {
    setIsBrewMode(false);
    setShowSaveForm(true);
    // Scroll to the save form with a small delay to ensure it's rendered
    setTimeout(() => {
      document
        .getElementById("save-session-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleExitBrewMode = () => {
    setIsBrewMode(false);
    onBrewModeExit?.();
  };

  if (steps.length === 0) {
    return null;
  }

  // Show brew mode if active - fullscreen zen mode using portal
  if (isBrewMode) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-olive-dark flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-2xl my-auto">
          <BrewMode
            steps={steps}
            coffeeAmount={coffeeAmount}
            totalBrewTime={totalBrewTime}
            methodName={methodName}
            waterTemperature={waterTemperature}
            selectedCoffeeId={selectedCoffeeId}
            brewingMethodId={brewingMethodId}
            onExit={handleExitBrewMode}
            onSaveSession={handleSaveSession}
          />
        </div>
      </div>,
      document.body
    );
  }

  const totalWater = steps.length > 0 ? steps[steps.length - 1].cumulativeWater : 0;

  // Show save session form instead of steps
  if (showSaveForm) {
    return (
      <div id="save-session-form">
        <SaveSessionForm
          coffeeAmount={coffeeAmount}
          waterAmount={totalWater}
          brewingMethodId={brewingMethodId}
          brewingMethodName={methodName || "Unknown Method"}
          brewTime={totalBrewTime}
          waterTemperature={waterTemperature}
          selectedCoffeeId={selectedCoffeeId}
          onSave={() => {
            setShowSaveForm(false);
            onSessionSaved?.();
          }}
          onCancel={() => setShowSaveForm(false)}
        />
      </div>
    );
  }

  return (
    <Section
      title="Brewing Steps"
      actions={
        <div className="flex gap-2">
          <Button
            onClick={() => setIsBrewMode(true)}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Enter Brew Mode
          </Button>
          <Button
            onClick={() => setShowSaveForm(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
            </svg>
            Save Session
          </Button>
        </div>
      }
    >
      {methodName && (
        <div className="mb-5 p-4 bg-white/80 dark:bg-olive-dark/50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs text-caramel/70 block mb-1">Method</span>
              <span className="text-sm font-semibold text-olive-dark dark:text-cream">{methodName}</span>
              {selectedCoffeeId && (
                <div className="mt-3 pt-3 border-t border-olive/30">
                  <span className="text-xs text-caramel/70 block mb-1">Coffee</span>
                  <span className="text-sm font-semibold text-olive-dark dark:text-cream">
                    {(() => {
                      const coffee = coffeeService.getCoffee(selectedCoffeeId);
                      return coffee ? `${coffee.brand} - ${coffee.name}` : "";
                    })()}
                  </span>
                </div>
              )}
            </div>
            {creditName && creditUrl && (
              <a
                href={creditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-coffee hover:text-caramel hover:underline inline-flex items-center gap-1 bg-coffee/10 px-3 py-2 rounded-md border border-coffee/30 transition-all w-fit"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="mb-5 p-4 bg-white/80 dark:bg-olive-dark/50 rounded-lg">
        <p className="text-sm text-olive dark:text-caramel">
          <span className="font-semibold text-olive-dark dark:text-cream">Coffee:</span> {coffeeAmount}g |
          <span className="font-semibold text-olive-dark dark:text-cream ml-2">Water:</span> {totalWater.toFixed(0)}g |
          {waterTemperature && (
            <>
              <span className="font-semibold text-olive-dark dark:text-cream ml-2">Temperature:</span> {waterTemperature}
              °C |
            </>
          )}
          <span className="font-semibold text-olive-dark dark:text-cream ml-2">Total Steps:</span> {steps.length}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {steps.map((step, index) => {
          const nextStep = steps[index + 1];
          const endTime = nextStep ? nextStep.timeSeconds : totalBrewTime;

          return (
            <div key={index} className="relative pl-12 sm:pl-20 pb-6 last:pb-0">
              {index < steps.length - 1 && (
                <div className="absolute left-5 sm:left-8 top-10 sm:top-16 w-0.5 h-full bg-gradient-to-b from-coffee/50 to-transparent"></div>
              )}

              <div className="absolute left-0 top-0 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-coffee to-coffee/70 rounded-lg flex items-center justify-center text-olive-dark dark:text-cream font-bold text-base sm:text-xl shadow-lg">
                {step.stepNumber}
              </div>

              <div className="bg-white/80 dark:bg-olive-dark/40 rounded-lg p-4 hover:bg-white dark:hover:bg-olive-dark/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-olive-dark dark:text-cream text-base">{step.description}</h3>
                  <span className="text-xl font-mono font-bold text-coffee ml-4 bg-coffee/10 px-3 py-1 rounded-md">
                    {formatTime(step.timeSeconds)} → {formatTime(endTime)}
                  </span>
                </div>

                {step.waterAmount > 0 && (
                  <div className="bg-white/60 dark:bg-olive/20 px-4 py-3 rounded-md">
                    <span className="text-caramel/80 text-xs block mb-1">Pour to</span>
                    <span className="font-bold text-olive-dark dark:text-cream text-2xl">
                      {step.cumulativeWater.toFixed(1)}g
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-coffee/20 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-olive dark:text-caramel" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-olive dark:text-caramel">Total Brew Time:</span>
          <span className="text-xl font-mono font-bold text-olive-dark dark:text-cream">
            {formatTime(totalBrewTime)}
          </span>
        </div>
      </div>
    </Section>
  );
};

export default BrewingSteps;
