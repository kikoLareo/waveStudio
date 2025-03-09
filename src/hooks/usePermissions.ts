import { useAuth } from '../context/AuthContext';
import { permissions, checkPermission } from '../config/permissions';
import { useEffect, useState } from 'react';
import api from '../services/api';
import logService from '../utils/logService';

interface Role {
  id: number;
  name: string;
  description?: string;
}

/**
 * Hook personalizado para manejar permisos de usuario
 * Proporciona funciones para verificar si el usuario tiene permisos para realizar acciones específicas
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar los nombres de los roles del usuario
  useEffect(() => {
    const fetchRoleNames = async () => {
      if (!user || !user.roles || user.roles.length === 0) {
        setUserRoles([]);
        setLoading(false);
        return;
      }

      try {
        // Obtener los nombres de los roles a partir de los IDs
        const rolePromises = user.roles.map(roleId => 
          api.get(`/roles/${roleId}`).then(response => response.data)
        );
        
        const rolesData = await Promise.all(rolePromises);
        const roleNames = rolesData.map((role: Role) => role.name.toLowerCase());
        
        setUserRoles(roleNames);
        logService.log('info', 'Roles de usuario cargados', { roles: roleNames });
      } catch (error) {
        logService.log('error', 'Error al cargar roles de usuario', { error });
        setUserRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleNames();
  }, [user]);

  /**
   * Verifica si el usuario tiene permiso para realizar una acción en un recurso específico
   * @param resource - El recurso sobre el que se quiere realizar la acción
   * @param action - La acción que se quiere realizar (read, write, delete)
   * @returns true si el usuario tiene permiso, false en caso contrario
   */
  const hasPermission = (resource: string, action: 'read' | 'write' | 'delete'): boolean => {
    // Si está cargando, asumir que no tiene permiso
    if (loading) return false;
    
    // Si no hay usuario o roles, no tiene permiso
    if (!user || userRoles.length === 0) return false;
    
    // Verificar si el usuario tiene el permiso
    return checkPermission(resource, action, userRoles);
  };

  /**
   * Verifica si el usuario tiene permiso de lectura para un recurso
   * @param resource - El recurso que se quiere leer
   * @returns true si el usuario tiene permiso de lectura, false en caso contrario
   */
  const canRead = (resource: string): boolean => {
    return hasPermission(resource, 'read');
  };

  /**
   * Verifica si el usuario tiene permiso de escritura para un recurso
   * @param resource - El recurso que se quiere modificar
   * @returns true si el usuario tiene permiso de escritura, false en caso contrario
   */
  const canWrite = (resource: string): boolean => {
    return hasPermission(resource, 'write');
  };

  /**
   * Verifica si el usuario tiene permiso de eliminación para un recurso
   * @param resource - El recurso que se quiere eliminar
   * @returns true si el usuario tiene permiso de eliminación, false en caso contrario
   */
  const canDelete = (resource: string): boolean => {
    return hasPermission(resource, 'delete');
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param roleName - El nombre del rol que se quiere verificar
   * @returns true si el usuario tiene el rol, false en caso contrario
   */
  const hasRole = (roleName: string): boolean => {
    return userRoles.includes(roleName.toLowerCase());
  };

  /**
   * Verifica si el usuario es administrador (tiene el rol 'admin' o 'master')
   * @returns true si el usuario es administrador, false en caso contrario
   */
  const isAdmin = (): boolean => {
    return hasRole('admin') || hasRole('master');
  };

  return {
    hasPermission,
    canRead,
    canWrite,
    canDelete,
    hasRole,
    isAdmin,
    loading,
    userRoles
  };
};
