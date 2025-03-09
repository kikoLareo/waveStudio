import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import logService from '../utils/logService';

// Interfaces
interface User {
  id: number;
  username: string;
  email: string;
  roles: number[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  hasRole: (roleId: number) => boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Intentar auto-login
        const user = await authService.attemptAutoLogin();
        if (user) {
          setUser(user);
          logService.log('info', 'Usuario autenticado automáticamente', { userId: user.id });
        }
      } catch (error) {
        logService.log('error', 'Error al inicializar autenticación', { error });
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (username: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      const user = await authService.login(username, password, rememberMe);
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      logService.log('error', 'Error en login desde AuthContext', { error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (roleId: number): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(roleId);
  };

  // Valor del contexto
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
