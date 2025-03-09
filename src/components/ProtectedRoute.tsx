import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logService from '../utils/logService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  // Verificar si el usuario tiene los roles requeridos
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some(roleId => hasRole(roleId));

  // Mientras se verifica la autenticación, mostrar un loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    logService.log('info', 'Redirigiendo a login: usuario no autenticado', { path: location.pathname });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no tiene los roles requeridos, redirigir a dashboard
  if (!hasRequiredRole) {
    logService.log('warn', 'Redirigiendo a dashboard: sin permisos', { 
      requiredRoles, 
      path: location.pathname 
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Si está autenticado y tiene los roles requeridos, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;
