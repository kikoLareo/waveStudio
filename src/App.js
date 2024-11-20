// src/App.js
import React from 'react';
import Navbar from './components/Navbar/NavBar'; // Asegúrate de que la ruta y el nombre del archivo sean correctos
import ErrorBoundary from './components/Boundary/ErrorBoundary'; // Asegúrate de que la ruta y el nombre del archivo sean correctos
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from './routes';


import ChampionshipDetail from './pages/ChampionshipDetailPage';
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
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
      </div>
    </ErrorBoundary>
    </Router>
  );

}

export default App;