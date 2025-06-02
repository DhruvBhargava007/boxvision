import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WarehouseProblemForm from './components/WarehouseProblemForm';
import ProblemTypeGrid from './components/ProblemTypeGrid';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProblemTypeGrid />} />
          <Route path="/form/:problemType" element={<WarehouseProblemForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
