import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analyzer from "./pages/Analyzer";
import ComponentDemo from "./pages/ComponentDemo";
import OAuthSuccess from "./pages/OAuthSuccess";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const themeProps = {
    darkMode,
    setDarkMode,
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home {...themeProps} />} />

        <Route path="/about" element={<About {...themeProps} />} />

        <Route path="/login" element={<Login {...themeProps} />} />

        <Route path="/register" element={<Register {...themeProps} />} />

        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard {...themeProps} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyzer"
          element={
            <ProtectedRoute>
              <Analyzer {...themeProps} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/components"
          element={
            <ProtectedRoute>
              <ComponentDemo {...themeProps} />
            </ProtectedRoute>
          }
        />

        {/* Unknown routes redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;