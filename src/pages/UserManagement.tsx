import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logService from '../utils/logService';
import { ArrowLeft, UserPlus, Edit, Trash2, Shield } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  roles?: { id: number; name: string }[];
}

interface Role {
  id: number;
  name: string;
  description?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Form states for creating a new user
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // Form states for editing a user
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRoles, setEditRoles] = useState<number[]>([]);

  // Verificar si el usuario actual es Master
  const checkIsMaster = () => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    try {
      const userData = JSON.parse(user);
      return userData.roles && userData.roles.includes(1); // Asumiendo que el rol Master tiene ID 1
    } catch (e) {
      return false;
    }
  };

  // Cargar usuarios y roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verificar si es usuario Master
        if (!checkIsMaster()) {
          setError('No tienes permisos para acceder a esta página');
          setLoading(false);
          return;
        }
        
        // Cargar usuarios y roles
        const [usersResponse, rolesResponse] = await Promise.all([
          api.get('/users'),
          api.get('/roles')
        ]);
        
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
        setLoading(false);
      } catch (error) {
        logService.log('error', 'Error al cargar datos de gestión de usuarios', { error });
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Crear un nuevo usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!newUsername || !newEmail || !newPassword) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      setLoading(true);
      
      // Crear usuario
      const response = await api.post('/users/master/create', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        roles: selectedRoles.length > 0 ? selectedRoles : undefined
      });
      
      // Actualizar lista de usuarios
      setUsers([...users, response.data]);
      
      // Limpiar formulario y cerrar modal
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setSelectedRoles([]);
      setShowCreateModal(false);
      
      logService.log('info', 'Usuario creado exitosamente', { userId: response.data.id });
    } catch (error) {
      logService.log('error', 'Error al crear usuario', { error });
      setError('Error al crear el usuario. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Editar usuario
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      
      // Actualizar información básica del usuario
      if (editUsername || editEmail) {
        await api.put(`/users/${selectedUser.id}/update`, {
          username: editUsername || undefined,
          email: editEmail || undefined
        });
      }
      
      // Actualizar contraseña si se proporciona
      if (editPassword) {
        await api.put(`/users/${selectedUser.id}/change-password`, {
          new_password: editPassword
        });
      }
      
      // Actualizar roles
      // Primero eliminar todos los roles actuales
      if (selectedUser.roles) {
        for (const role of selectedUser.roles) {
          await api.delete(`/users/${selectedUser.id}/remove-role/${role.id}`);
        }
      }
      
      // Luego asignar los nuevos roles
      for (const roleId of editRoles) {
        await api.post(`/users/${selectedUser.id}/assign-role/${roleId}`);
      }
      
      // Recargar la lista de usuarios
      const response = await api.get('/users');
      setUsers(response.data);
      
      // Cerrar modal y limpiar formulario
      setShowEditModal(false);
      setSelectedUser(null);
      setEditUsername('');
      setEditEmail('');
      setEditPassword('');
      setEditRoles([]);
      
      logService.log('info', 'Usuario actualizado exitosamente', { userId: selectedUser.id });
    } catch (error) {
      logService.log('error', 'Error al actualizar usuario', { error, userId: selectedUser.id });
      setError('Error al actualizar el usuario. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      
      await api.delete(`/users/${selectedUser.id}/delete`);
      
      // Actualizar lista de usuarios
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      // Cerrar modal
      setShowDeleteModal(false);
      setSelectedUser(null);
      
      logService.log('info', 'Usuario eliminado exitosamente', { userId: selectedUser.id });
    } catch (error) {
      logService.log('error', 'Error al eliminar usuario', { error, userId: selectedUser.id });
      setError('Error al eliminar el usuario. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Preparar edición de usuario
  const prepareEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditPassword('');
    setEditRoles(user.roles ? user.roles.map(role => role.id) : []);
    setShowEditModal(true);
  };

  // Preparar eliminación de usuario
  const prepareDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {user.roles && user.roles.map(role => (
                        <span
                          key={role.id}
                          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {role.name}
                        </span>
                      ))}
                      {(!user.roles || user.roles.length === 0) && (
                        <span className="text-sm text-gray-500">Sin roles</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => prepareEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => prepareDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>
            
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Nombre de Usuario *
                </label>
                <input
                  id="username"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Contraseña *
                </label>
                <input
                  id="password"
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirmar Contraseña *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Roles
                </label>
                <div className="mt-2 space-y-2">
                  {roles.map(role => (
                    <div key={role.id} className="flex items-center">
                      <input
                        id={`role-${role.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedRoles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRoles([...selectedRoles, role.id]);
                          } else {
                            setSelectedRoles(selectedRoles.filter(id => id !== role.id));
                          }
                        }}
                      />
                      <label htmlFor={`role-${role.id}`} className="ml-2 block text-sm text-gray-900">
                        {role.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Editar Usuario: {selectedUser.username}</h2>
            
            <form onSubmit={handleEditUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editUsername">
                  Nombre de Usuario
                </label>
                <input
                  id="editUsername"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editEmail">
                  Email
                </label>
                <input
                  id="editEmail"
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editPassword">
                  Nueva Contraseña (dejar en blanco para no cambiar)
                </label>
                <input
                  id="editPassword"
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Roles
                </label>
                <div className="mt-2 space-y-2">
                  {roles.map(role => (
                    <div key={role.id} className="flex items-center">
                      <input
                        id={`edit-role-${role.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={editRoles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditRoles([...editRoles, role.id]);
                          } else {
                            setEditRoles(editRoles.filter(id => id !== role.id));
                          }
                        }}
                      />
                      <label htmlFor={`edit-role-${role.id}`} className="ml-2 block text-sm text-gray-900">
                        {role.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para confirmar eliminación */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-6">
              ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser.username}</strong>?
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDeleteUser}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
