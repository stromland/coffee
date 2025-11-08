import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppProvider } from "./app/AppContext";
import AppLayout from "./app/components/AppLayout";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lastVisited = localStorage.getItem("coffee-last-visited");
    if (lastVisited) {
      localStorage.removeItem("coffee-last-visited");
      const nextPath = lastVisited.replace(location.pathname, "");
      console.log("Current path:", location.pathname);
      console.log("Navigating to last visited path:", nextPath);
      navigate(nextPath, { replace: true });
    }
  }, [navigate, location]);

  return (
    <AppProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AppProvider>
  );
}

export default App;
