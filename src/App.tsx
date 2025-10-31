import { useState, useEffect } from "react";
import CoffeeCalculator from "./components/CoffeeCalculator";
import BrewingPresets from "./components/BrewingPresets";
import BrewingSteps from "./components/BrewingSteps";
import SaveSessionForm from "./components/SaveSessionForm";
import BrewingHistory from "./components/BrewingHistory";
import BrewMethodManager from "./components/BrewMethodManager";
import type { CoffeeSettings, BrewStep, BrewingSession } from "./types/coffee";
import { brewingService } from "./core/services";

type Page = "dashboard" | "history" | "methods";

// Helper to calculate total brew time from steps and drawdown
const calculateTotalBrewTime = (steps: BrewStep[], drawdownTime: number): number => {
  if (steps.length === 0) return 0;
  const lastStepTime = steps[steps.length - 1].timeSeconds;
  return lastStepTime + drawdownTime;
};

function App() {
  const [settings, setSettings] = useState<CoffeeSettings>({
    coffeeAmount: 20,
    waterRatio: 15,
    totalWater: 300,
  });

  const [selectedMethodId, setSelectedMethodId] = useState<string>("4-6-original");
  const [brewSteps, setBrewSteps] = useState<BrewStep[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [historyKey, setHistoryKey] = useState(0);

  const handleSettingsChange = (newSettings: CoffeeSettings) => {
    setSettings(newSettings);
    updateBrewSteps(selectedMethodId, newSettings.totalWater);
  };

  const handleMethodChange = (methodId: string) => {
    setSelectedMethodId(methodId);
    updateBrewSteps(methodId, settings.totalWater);
  };

  const handleMethodSelected = (methodId: string) => {
    setSelectedMethodId(methodId);
    updateBrewSteps(methodId, settings.totalWater);
    setCurrentPage("dashboard");
  };

  const updateBrewSteps = (methodId: string, totalWater: number) => {
    const method = brewingService.getBrewMethod(methodId);
    if (method && totalWater > 0) {
      const steps = brewingService.generateBrewSteps(methodId, totalWater);
      setBrewSteps(steps);
    } else {
      setBrewSteps([]);
    }
  };

  const handleSaveSession = () => {
    setHistoryKey((prev) => prev + 1); // Force history to refresh
  };

  const handleBrewAgain = (session: BrewingSession) => {
    // Calculate the water ratio from the session data
    const waterRatio = session.waterAmount / session.coffeeAmount;

    // Update settings
    setSettings({
      coffeeAmount: session.coffeeAmount,
      waterRatio: waterRatio,
      totalWater: session.waterAmount,
    });

    // Update method
    setSelectedMethodId(session.brewingMethod);
    updateBrewSteps(session.brewingMethod, session.waterAmount);

    // Switch to dashboard view
    setCurrentPage("dashboard");
  };

  // Initialize brew steps on mount
  useEffect(() => {
    updateBrewSteps(selectedMethodId, settings.totalWater);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-olive-dark">
      <div className="bg-gradient-to-br from-olive-dark via-olive-dark to-olive/20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-8">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-cream mb-1 flex items-center gap-3">
                    ☕ Coffee Brew Dashboard
                  </h1>
                  <p className="text-caramel/80">
                    Perfect your pour-over with precise measurements and timing
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage("dashboard")}
                    className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                      currentPage === "dashboard"
                        ? "bg-coffee text-cream"
                        : "bg-olive/20 text-caramel hover:text-cream hover:bg-olive/30"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage("methods")}
                    className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                      currentPage === "methods"
                        ? "bg-coffee text-cream"
                        : "bg-olive/20 text-caramel hover:text-cream hover:bg-olive/30"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Methods
                  </button>
                  <button
                    onClick={() => setCurrentPage("history")}
                    className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                      currentPage === "history"
                        ? "bg-coffee text-cream"
                        : "bg-olive/20 text-caramel hover:text-cream hover:bg-olive/30"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    History
                  </button>
                </div>
              </div>
            </div>
          </header>

          {currentPage === "dashboard" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 lg:order-1 space-y-6">
                <CoffeeCalculator settings={settings} onSettingsChange={handleSettingsChange} />

                <div className="lg:hidden">
                  <BrewingPresets
                    selectedMethodId={selectedMethodId}
                    onMethodChange={handleMethodChange}
                  />
                </div>

                {brewSteps.length > 0 && (
                  <BrewingSteps
                    steps={brewSteps}
                    coffeeAmount={settings.coffeeAmount}
                    totalBrewTime={calculateTotalBrewTime(
                      brewSteps,
                      brewingService.getDrawdownTime(selectedMethodId)
                    )}
                    methodName={brewingService.getBrewMethod(selectedMethodId)?.name}
                    creditName={brewingService.getBrewMethod(selectedMethodId)?.creditName}
                    creditUrl={brewingService.getBrewMethod(selectedMethodId)?.creditUrl}
                  />
                )}

                <SaveSessionForm
                  coffeeAmount={settings.coffeeAmount}
                  waterAmount={settings.totalWater}
                  brewingMethodId={selectedMethodId}
                  brewingMethodName={
                    brewingService.getBrewMethod(selectedMethodId)?.name || selectedMethodId
                  }
                  brewTime={calculateTotalBrewTime(
                    brewSteps,
                    brewingService.getDrawdownTime(selectedMethodId)
                  )}
                  onSave={handleSaveSession}
                />
              </div>

              <div className="hidden lg:block lg:col-span-1 lg:order-2">
                <BrewingPresets
                  selectedMethodId={selectedMethodId}
                  onMethodChange={handleMethodChange}
                />
              </div>
            </div>
          ) : currentPage === "methods" ? (
            <BrewMethodManager onMethodChange={handleMethodSelected} />
          ) : (
            <BrewingHistory key={historyKey} onBrewAgain={handleBrewAgain} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
