import { useState } from 'react';
import CoffeeCalculator from './components/CoffeeCalculator';
import BrewingPresets from './components/BrewingPresets';
import BrewingSteps from './components/BrewingSteps';
import type { CoffeeSettings, BrewStep } from './types/coffee';
import { getBrewMethod } from './utils/coffeeCalculations';

function App() {
  const [settings, setSettings] = useState<CoffeeSettings>({
    coffeeAmount: 20,
    waterRatio: 15,
    totalWater: 300,
  });

  const [selectedMethodId, setSelectedMethodId] = useState<string>('4-6');
  const [brewSteps, setBrewSteps] = useState<BrewStep[]>([]);

  const handleSettingsChange = (newSettings: CoffeeSettings) => {
    setSettings(newSettings);
    updateBrewSteps(selectedMethodId, newSettings.totalWater);
  };

  const handleMethodChange = (methodId: string) => {
    setSelectedMethodId(methodId);
    updateBrewSteps(methodId, settings.totalWater);
  };

  const updateBrewSteps = (methodId: string, totalWater: number) => {
    const method = getBrewMethod(methodId);
    if (method && totalWater > 0) {
      const steps = method.generateSteps(totalWater);
      setBrewSteps(steps);
    } else {
      setBrewSteps([]);
    }
  };

  // Initialize brew steps on mount
  useState(() => {
    updateBrewSteps(selectedMethodId, settings.totalWater);
  });

  return (
    <div className="min-h-screen bg-olive-dark">
      <div className="bg-gradient-to-br from-olive-dark via-olive-dark to-olive/20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-cream mb-1 flex items-center gap-3">
                  ☕ Coffee Brew Dashboard
                </h1>
                <p className="text-caramel/80">
                  Perfect your pour-over with precise measurements and timing
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-olive/30 px-4 py-2 rounded-lg border border-coffee/30">
                <div className="w-2 h-2 bg-coffee rounded-full animate-pulse"></div>
                <span className="text-cream text-sm font-medium">Live</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CoffeeCalculator 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />

              {brewSteps.length > 0 && (
                <BrewingSteps 
                  steps={brewSteps} 
                  coffeeAmount={settings.coffeeAmount}
                  totalBrewTime={getBrewMethod(selectedMethodId)?.totalBrewTime || 0}
                  methodName={getBrewMethod(selectedMethodId)?.name}
                  creditName={getBrewMethod(selectedMethodId)?.creditName}
                  creditUrl={getBrewMethod(selectedMethodId)?.creditUrl}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <BrewingPresets 
                selectedMethodId={selectedMethodId} 
                onMethodChange={handleMethodChange} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
