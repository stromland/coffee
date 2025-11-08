import { useNavigate } from "react-router-dom";
import CoffeeCalculator from "../../components/CoffeeCalculator";
import CoffeeTemperatureSelector from "../../components/CoffeeTemperatureSelector";
import BrewingPresets from "../../components/BrewingPresets";
import BrewingSteps from "../../components/BrewingSteps";
import { useAppContext } from "../AppContext";
import { brewingService } from "../../core/services";

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    settings,
    selectedMethodId,
    selectedCoffeeId,
    waterTemperature,
    brewSteps,
    handleSettingsChange,
    handleMethodChange,
    handleCoffeeChange,
    handleTemperatureChange,
    handleSaveSession,
  } = useAppContext();

  const onSaveSession = () => {
    handleSaveSession();
    navigate("/history");
  };

  const handleBrewModeExit = () => {
    // Scroll to brewing steps when exiting brew mode
    const brewingStepsElement = document.getElementById("brewing-steps");
    if (brewingStepsElement) {
      brewingStepsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 lg:order-1 space-y-6">
        <CoffeeCalculator settings={settings} onSettingsChange={handleSettingsChange} />

        <CoffeeTemperatureSelector
          selectedCoffeeId={selectedCoffeeId}
          waterTemperature={waterTemperature}
          onCoffeeChange={handleCoffeeChange}
          onTemperatureChange={handleTemperatureChange}
        />

        <div className="lg:hidden">
          <BrewingPresets selectedMethodId={selectedMethodId} onMethodChange={handleMethodChange} />
        </div>

        {brewSteps.length > 0 && (
          <div id="brewing-steps">
            <BrewingSteps
              steps={brewSteps}
              coffeeAmount={settings.coffeeAmount}
              totalBrewTime={brewingService.calculateTotalBrewTime(selectedMethodId)}
              methodName={brewingService.getBrewMethod(selectedMethodId)?.name}
              creditName={brewingService.getBrewMethod(selectedMethodId)?.creditName}
              creditUrl={brewingService.getBrewMethod(selectedMethodId)?.creditUrl}
              brewingMethodId={selectedMethodId}
              waterTemperature={waterTemperature}
              selectedCoffeeId={selectedCoffeeId}
              onSessionSaved={onSaveSession}
              onBrewModeExit={handleBrewModeExit}
            />
          </div>
        )}
      </div>

      <div className="hidden lg:block lg:col-span-1 lg:order-2">
        <BrewingPresets selectedMethodId={selectedMethodId} onMethodChange={handleMethodChange} />
      </div>
    </div>
  );
};

export default DashboardPage;
