import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComponentById } from '../services/componentService';
import { 
  ArrowLeft,
  User,
  Mail,
  Shield,
  Clock,
  Calendar,
  Edit,
  Key,
  Trophy,
  Briefcase
} from 'lucide-react';
import api from '../services/api';
import logService from '../utils/logService';

interface Assignment {
  id: string;
  championship_id: string;
  championshipName: string;
  positionTitle: string;
  hours_worked: number;
  status: string;
  start_date: string;
  end_date: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  permissions?: string[];
  assignments?: Assignment[];
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!id) {
          throw new Error('ID is undefined');
        }
        const response = await getComponentById(`users`, id);
        setUser(response.data);
        logService.log('info', `Detalles del usuario ${id} obtenidos exitosamente`);
      } catch (error) {
        const errorMessage = 'Error al obtener los detalles del usuario';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleChampionshipClick = (championshipId: string) => {
    navigate(`/championships/${championshipId}`);
  };

  const handleAssignmentClick = (assignmentId: string) => {
    navigate(`/assignments/${assignmentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error || 'No se encontró el usuario'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              `}>
                {user.active ? 'Activo' : 'Inactivo'}
              </span>
              <button
                onClick={() => navigate(`/users/edit/${user.id}`)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Información de la Cuenta</h2>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="text-gray-900">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Permisos</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.permissions?.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Actividad</h2>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Último Acceso</p>
                <p className="text-gray-900">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Nunca'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha de Creación</p>
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Asignaciones */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Trabajos</h2>
          
          {user.assignments && user.assignments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campeonato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periodo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.assignments.map((assignment) => (
                    <tr 
                      key={assignment.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAssignmentClick(assignment.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChampionshipClick(assignment.championship_id);
                          }}
                        >
                          <Trophy className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-blue-600 hover:text-blue-800">
                            {assignment.championshipName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-900">{assignment.positionTitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {assignment.hours_worked}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${assignment.status === 'Activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }
                        `}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(assignment.start_date).toLocaleDateString()} - 
                        {new Date(assignment.end_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Este usuario no tiene asignaciones
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;