import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { ProfileProvider } from "./context/ProfileContext";
import "./index.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute allowedUserType="user">
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedUserType="admin">
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </UserProvider>
  </StrictMode>
);
