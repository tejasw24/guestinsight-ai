import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Analyzer from "./pages/Analyzer";
import ComponentDemo from "./pages/ComponentDemo";

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/about" element={<About darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/analyzer" element={<Analyzer darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/components" element={<ComponentDemo darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;