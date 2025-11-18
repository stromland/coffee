import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppProvider } from "./app/AppContext";
import AppLayout from "./app/components/AppLayout";
import { ThemeProvider } from "./shared/context/ThemeContext";

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
    <ThemeProvider>
      <AppProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
