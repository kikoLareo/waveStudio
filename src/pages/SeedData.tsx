import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Check, AlertCircle, Loader2 } from 'lucide-react';
import seedData from '../utils/seedData';
import logService from '../utils/logService';

const SeedDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const handleSeedData = async () => {
    try {
      setLoading(true);
      logService.log('info', 'Iniciando generación de datos de ejemplo');
      
      const seedResult = await seedData();
      setResult(seedResult);
      
      logService.log('info', 'Resultado de generación de datos', { result: seedResult });
    } catch (error) {
      logService.log('error', 'Error al generar datos de ejemplo', { error });
      setResult({
        success: false,
        message: 'Error al generar datos de ejemplo'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-center mb-6">
              <Database className="h-12 w-12 text-blue-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Generador de Datos de Ejemplo
            </h1>
            
            <p className="text-center text-gray-600 mb-8">
              Esta herramienta generará datos de ejemplo para probar la aplicación.
              Se crearán usuarios, roles, organizadores, disciplinas, puestos de trabajo,
              campeonatos y asignaciones.
            </p>
            
            {result && (
              <div className={`mb-8 p-4 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {result.success ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                      {result.message}
                    </h3>
                    
                    {result.success && result.data && (
                      <div className="mt-2 text-sm text-gray-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Roles: {result.data.roles}</li>
                          <li>Usuarios: {result.data.users}</li>
                          <li>Organizadores: {result.data.organizers}</li>
                          <li>Disciplinas: {result.data.disciplines}</li>
                          <li>Puestos de trabajo: {result.data.jobPositions}</li>
                          <li>Campeonatos: {result.data.championships}</li>
                          <li>Asignaciones: {result.data.assignments}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleSeedData}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generando datos...
                  </>
                ) : (
                  'Generar Datos de Ejemplo'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Credenciales de Acceso
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contraseña
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      admin
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      admin123
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Administrador
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      juez1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      juez123
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Juez
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      organizador1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      org123
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Organizador
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedDataPage;
