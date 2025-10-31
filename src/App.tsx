import { Outlet } from "react-router-dom";
import { AppProvider } from "./app/AppContext";
import AppLayout from "./app/components/AppLayout";

function App() {
  return (
    <AppProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AppProvider>
  );
}

export default App;
