import React from "react";
import { Routes, Route } from "react-router-dom";
import HRUpload from "./pages/HRUpload";
import './index.css'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HRUpload />} />
    </Routes>
  );
};

export default App;