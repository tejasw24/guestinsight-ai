import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Analyzer from "./pages/Analyzer";
import ComponentDemo from "./pages/ComponentDemo";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/login" element={<Login />} />

        <Route path="/analyzer" element={<Analyzer />} />

        <Route path="/components" element={<ComponentDemo />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;