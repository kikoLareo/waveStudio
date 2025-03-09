import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { ErrorBoundary } from './boundary';
import routes from './routes';
import logService from './utils/logService';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componente para controlar la visualización del Navbar
const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Registrar navegación
    logService.log('info', 'Navegación a ruta', { path: location.pathname });
  }, [location.pathname]);

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (isLoading && location.pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // No mostrar Navbar en la página de login
  const showNavbar = isAuthenticated && location.pathname !== '/login';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        {showNavbar && <Navbar />}
        <main className={`${showNavbar ? 'container mx-auto px-4 py-8' : ''}`}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
