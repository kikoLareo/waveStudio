import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logService from '../utils/logService';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validar campos
      if (!username || !password) {
        setError('Por favor, completa todos los campos');
        return;
      }

      // Usar el contexto de autenticación para iniciar sesión
      await login(username, password, rememberMe);
      
      // La redirección se maneja en el contexto de autenticación
    } catch (error: any) {
      logService.log('error', 'Error en login', { error });
      
      // Usar la información adicional del error si está disponible
      if (error.authError) {
        // Errores específicos de autenticación
        switch (error.errorCode) {
          case 'INVALID_CREDENTIALS':
            setError('Usuario o contraseña incorrectos');
            break;
          case 'MISSING_FIELDS':
            setError('Por favor, completa todos los campos');
            break;
          case 'NETWORK_ERROR':
            setError('Error de conexión con el servidor. Verifica tu conexión a internet.');
            break;
          default:
            setError(error.errorDetails || 'Ha ocurrido un error durante la autenticación');
        }
      } else if (error.response) {
        // Errores con respuesta del servidor
        if (error.response.status === 401) {
          setError('Usuario o contraseña incorrectos');
        } else if (error.response.status === 422) {
          setError('Formato de datos inválido. Verifica la información ingresada.');
        } else {
          // Extraer mensaje de error de la respuesta
          const errorDetail = error.response.data?.detail?.message || 
                             error.response.data?.detail || 
                             error.response.data?.message || 
                             'Ha ocurrido un error';
          setError(`Error: ${errorDetail}`);
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        // Error al configurar la petición
        setError(error.message || 'Ha ocurrido un error inesperado');
      }
      
      // Registrar el error para análisis
      logService.log('error', 'Error detallado en login', { 
        errorMessage: error.message,
        errorCode: error.errorCode,
        errorDetails: error.errorDetails,
        status: error.response?.status,
        responseData: error.response?.data
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px mb-4">
            <div>
              <label htmlFor="username" className="sr-only">Nombre de usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
