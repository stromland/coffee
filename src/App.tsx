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
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-olive-dark mb-2">
            ☕ Coffee Brew Calculator
          </h1>
          <p className="text-olive">
            Perfect your pour-over with precise measurements and timing
          </p>
        </header>

        <CoffeeCalculator 
          settings={settings} 
          onSettingsChange={handleSettingsChange} 
        />

        <BrewingPresets 
          selectedMethodId={selectedMethodId} 
          onMethodChange={handleMethodChange} 
        />

        {brewSteps.length > 0 && (
          <BrewingSteps 
            steps={brewSteps} 
            coffeeAmount={settings.coffeeAmount}
            totalBrewTime={getBrewMethod(selectedMethodId)?.totalBrewTime || 0}
          />
        )}
      </div>
    </div>
  );
}

export default App;
