import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CoffeeSettings, BrewStep, BrewingSession } from "../types/coffee";
import { brewingService, coffeeService } from "../core/services";

interface AppContextValue {
  settings: CoffeeSettings;
  selectedMethodId: string;
  selectedCoffeeId: string | null;
  waterTemperature: number | null;
  brewSteps: BrewStep[];
  historyKey: number;
  handleSettingsChange: (newSettings: CoffeeSettings) => void;
  handleMethodChange: (methodId: string) => void;
  handleMethodSelected: (methodId: string) => void;
  handleCoffeeChange: (coffeeId: string | null) => void;
  handleTemperatureChange: (temperature: number | null) => void;
  handleSaveSession: () => void;
  handleBrewAgain: (session: BrewingSession) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<CoffeeSettings>({
    coffeeAmount: 20,
    waterRatio: 15,
    totalWater: 300,
  });

  const [selectedMethodId, setSelectedMethodId] = useState<string>("4-6-original");
  const [selectedCoffeeId, setSelectedCoffeeId] = useState<string | null>(null);
  const [waterTemperature, setWaterTemperature] = useState<number | null>(null);
  const [brewSteps, setBrewSteps] = useState<BrewStep[]>([]);
  const [historyKey, setHistoryKey] = useState(0);

  const getDefaultTemperature = (coffeeId: string | null): number | null => {
    if (!coffeeId) return null;
    const coffee = coffeeService.getCoffee(coffeeId);
    if (!coffee) return null;
    switch (coffee.roast) {
      case "light":
        return 93;
      case "medium":
        return 88;
      case "dark":
        return 83;
      default:
        return null;
    }
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
  };

  const handleCoffeeChange = (coffeeId: string | null) => {
    setSelectedCoffeeId(coffeeId);
    setWaterTemperature(getDefaultTemperature(coffeeId));
  };

  const handleTemperatureChange = (temperature: number | null) => {
    setWaterTemperature(temperature);
  };

  const handleSaveSession = () => {
    setHistoryKey((prev) => prev + 1);
  };

  const handleBrewAgain = (session: BrewingSession) => {
    const waterRatio = session.waterAmount / session.coffeeAmount;

    setSettings({
      coffeeAmount: session.coffeeAmount,
      waterRatio: waterRatio,
      totalWater: session.waterAmount,
    });

    setSelectedMethodId(session.brewingMethod);
    
    // Restore the selected coffee if the session has a coffeeId and the coffee still exists
    if (session.coffeeId) {
      const coffee = coffeeService.getCoffee(session.coffeeId);
      if (coffee) {
        setSelectedCoffeeId(session.coffeeId);
        
        // Set water temperature from session, or default based on coffee if available
        if (session.waterTemperature) {
          setWaterTemperature(session.waterTemperature);
        } else {
          setWaterTemperature(getDefaultTemperature(session.coffeeId));
        }
      }
    } else if (session.waterTemperature) {
      // If no coffeeId but has temperature, restore it
      setWaterTemperature(session.waterTemperature);
    }
    
    updateBrewSteps(session.brewingMethod, session.waterAmount);
  };

  useEffect(() => {
    updateBrewSteps(selectedMethodId, settings.totalWater);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        selectedMethodId,
        selectedCoffeeId,
        waterTemperature,
        brewSteps,
        historyKey,
        handleSettingsChange,
        handleMethodChange,
        handleMethodSelected,
        handleCoffeeChange,
        handleTemperatureChange,
        handleSaveSession,
        handleBrewAgain,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
