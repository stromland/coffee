import { useState } from 'react';
import CoffeeCalculator from './components/CoffeeCalculator';
import BrewingPresets from './components/BrewingPresets';
import BrewingSteps from './components/BrewingSteps';
import FourSixPresetManager from './components/FourSixPresetManager';
import SaveSessionDialog from './components/SaveSessionDialog';
import BrewingHistory from './components/BrewingHistory';
import type { CoffeeSettings, BrewStep } from './types/coffee';
import { getBrewMethod } from './utils/coffeeCalculations';

function App() {
  const [settings, setSettings] = useState<CoffeeSettings>({
    coffeeAmount: 20,
    waterRatio: 15,
    totalWater: 300,
  });

  const [selectedMethodId, setSelectedMethodId] = useState<string>('4-6');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('default-46');
  const [brewSteps, setBrewSteps] = useState<BrewStep[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const handleSettingsChange = (newSettings: CoffeeSettings) => {
    setSettings(newSettings);
    updateBrewSteps(selectedMethodId, newSettings.totalWater, selectedPresetId);
  };

  const handleMethodChange = (methodId: string) => {
    setSelectedMethodId(methodId);
    if (methodId === '4-6') {
      updateBrewSteps(methodId, settings.totalWater, selectedPresetId);
    } else {
      updateBrewSteps(methodId, settings.totalWater);
    }
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    updateBrewSteps(selectedMethodId, settings.totalWater, presetId);
  };

  const updateBrewSteps = (methodId: string, totalWater: number, presetId?: string) => {
    const method = getBrewMethod(methodId);
    if (method && totalWater > 0) {
      const steps = method.generateSteps(totalWater, presetId);
      setBrewSteps(steps);
    } else {
      setBrewSteps([]);
    }
  };

  const handleSaveSession = () => {
    setShowSaveDialog(false);
    setHistoryKey(prev => prev + 1); // Force history to refresh
  };

  // Initialize brew steps on mount
  useState(() => {
    updateBrewSteps(selectedMethodId, settings.totalWater, selectedPresetId);
  });

  return (
    <div className="min-h-screen bg-olive-dark">
      <div className="bg-gradient-to-br from-olive-dark via-olive-dark to-olive/20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-cream mb-1 flex items-center gap-3">
                  ☕ Coffee Brew Dashboard
                </h1>
                <p className="text-caramel/80">
                  Perfect your pour-over with precise measurements and timing
                </p>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                  showHistory
                    ? 'bg-coffee text-cream'
                    : 'bg-olive/20 text-caramel hover:text-cream hover:bg-olive/30'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 lg:order-1 space-y-6">
              <CoffeeCalculator 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />

              <div className="lg:hidden">
                <BrewingPresets 
                  selectedMethodId={selectedMethodId} 
                  onMethodChange={handleMethodChange} 
                />
              </div>

              {selectedMethodId === '4-6' && (
                <FourSixPresetManager
                  selectedPresetId={selectedPresetId}
                  onPresetChange={handlePresetChange}
                />
              )}

              {brewSteps.length > 0 && (
                <BrewingSteps 
                  steps={brewSteps} 
                  coffeeAmount={settings.coffeeAmount}
                  totalBrewTime={getBrewMethod(selectedMethodId)?.totalBrewTime || 0}
                  methodName={getBrewMethod(selectedMethodId)?.name}
                  creditName={getBrewMethod(selectedMethodId)?.creditName}
                  creditUrl={getBrewMethod(selectedMethodId)?.creditUrl}
                  onSaveSession={() => setShowSaveDialog(true)}
                />
              )}

              {showHistory && (
                <BrewingHistory key={historyKey} />
              )}
            </div>

            <div className="hidden lg:block lg:col-span-1 lg:order-2">
              <BrewingPresets 
                selectedMethodId={selectedMethodId} 
                onMethodChange={handleMethodChange} 
              />
            </div>
          </div>
        </div>
      </div>

      <SaveSessionDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveSession}
        coffeeAmount={settings.coffeeAmount}
        waterAmount={settings.totalWater}
        brewingMethodId={selectedMethodId}
        brewingMethodName={getBrewMethod(selectedMethodId)?.name || selectedMethodId}
        brewTime={getBrewMethod(selectedMethodId)?.totalBrewTime}
      />
    </div>
  );
}

export default App;
