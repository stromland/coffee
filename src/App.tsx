import { Outlet } from "react-router-dom";
import { AppProvider } from "./app/AppContext";
import AppLayout from "./app/components/AppLayout";
import ServiceWorkerUpdate from "./app/components/ServiceWorkerUpdate";

function App() {
  return (
    <AppProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <ServiceWorkerUpdate />
    </AppProvider>
  );
}

export default App;
