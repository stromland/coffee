import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "./pages/DashboardPage";
import MethodsPage from "./pages/MethodsPage";
import HistoryPage from "./pages/HistoryPage";
import CoffeePage from "./pages/CoffeePage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "methods",
          element: <MethodsPage />,
        },
        {
          path: "coffee",
          element: <CoffeePage />,
        },
        {
          path: "history",
          element: <HistoryPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
