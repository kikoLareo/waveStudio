import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Shield,
  Users,
  Check,
  X,
  Edit,
  Calendar,
  User,
  Mail,
  Clock
} from 'lucide-react';
import api from '../services/api';
import logService from '../utils/logService';

interface Permission {
  resource: string;
  actions: string[];
}

interface RoleUser {
  id: string;
  username: string;
  email: string;
  active: boolean;
  lastLogin?: string;
}

interface RoleData {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
  users: RoleUser[];
}

const RoleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<RoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await api.get(`/roles/${id}`);
        setRole(response.data);
        logService.log('info', `Detalles del rol ${id} obtenidos exitosamente`);
      } catch (error) {
        const errorMessage = 'Error al obtener los detalles del rol';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoleDetails();
    }
  }, [id]);

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  // Verificar si una acción está permitida para un recurso
  const hasPermission = (resource: Permission, action: string): boolean => {
    return Array.isArray(resource.actions) && resource.actions.includes(action);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error || 'No se encontró el rol'}
        </div>
      </div>
    );
  }

  const permissionActions = ['read', 'write', 'delete'] as const;

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
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{role.name}</h1>
                <p className="text-gray-500">{role.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {role.userCount} usuarios
                </span>
              </div>
              <button
                onClick={() => navigate(`/roles/edit/${role.id}`)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Permisos */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Permisos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(role.permissions) && role.permissions.map((permission) => (
              <div
                key={permission.resource}
                className="bg-gray-50 rounded-lg p-4 space-y-3"
              >
                <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span>{permission.resource}</span>
                </h3>
                <div className="space-y-2">
                  {permissionActions.map((action) => (
                    <div
                      key={`${permission.resource}-${action}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{action}</span>
                      {hasPermission(permission, action) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usuarios */}
        <div className="p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Usuarios con este Rol</h2>
          {Array.isArray(role.users) && role.users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {role.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.username}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {user.lastLogin ? (
                        <span>Último acceso: {new Date(user.lastLogin).toLocaleDateString()}</span>
                      ) : (
                        <span>Sin accesos</span>
                      )}
                    </div>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay usuarios asignados a este rol
            </div>
          )}
        </div>

        {/* Información Adicional */}
        <div className="p-8 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Creado</p>
                <p className="text-gray-900">
                  {new Date(role.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Última Actualización</p>
                <p className="text-gray-900">
                  {new Date(role.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDetail;