import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "./pages/DashboardPage";
import MethodsPage from "./pages/MethodsPage";
import HistoryPage from "./pages/HistoryPage";

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
          path: "history",
          element: <HistoryPage />,
        },
      ],
    },
  ],
  {
    basename: "/coffee",
  }
);
