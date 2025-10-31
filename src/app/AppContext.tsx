import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CoffeeSettings, BrewStep, BrewingSession } from "../types/coffee";
import { brewingService } from "../core/services";

interface AppContextValue {
  settings: CoffeeSettings;
  selectedMethodId: string;
  brewSteps: BrewStep[];
  historyKey: number;
  handleSettingsChange: (newSettings: CoffeeSettings) => void;
  handleMethodChange: (methodId: string) => void;
  handleMethodSelected: (methodId: string) => void;
  handleSaveSession: () => void;
  handleBrewAgain: (session: BrewingSession) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

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
  const [brewSteps, setBrewSteps] = useState<BrewStep[]>([]);
  const [historyKey, setHistoryKey] = useState(0);

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
        brewSteps,
        historyKey,
        handleSettingsChange,
        handleMethodChange,
        handleMethodSelected,
        handleSaveSession,
        handleBrewAgain,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
