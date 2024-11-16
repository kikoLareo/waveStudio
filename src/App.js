// src/App.js
import React from 'react';
import Navbar from './components/Navbar/NavBar'; // Asegúrate de que la ruta y el nombre del archivo sean correctos
import ErrorBoundary from './components/Boundary/ErrorBoundary'; // Asegúrate de que la ruta y el nombre del archivo sean correctos
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Roles from './pages/Roles';
import Users from './pages/Users';
import Championships from './pages/Championships';
import Assignments from './pages/Assignments';
import JobPositions from './pages/JobPositions';

function App() {
  return (
    <Router>
    <ErrorBoundary>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/users" element={<Users />} />
          <Route path="/championships" element={<Championships />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/job-positions" element={<JobPositions />} />
      </Routes>
        {/* Agrega otros componentes aquí */}
        <h1>¡Bienvenido a WaveStudio!</h1>
      </div>
    </ErrorBoundary>
    </Router>
  );

}

export default App;