import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericPage from './GenericPage';
import { users } from '../schemas/schemas';
import logService from '../utils/logService';

const Users: React.FC = () => {
  const navigate = useNavigate();

  // Manejar clic en una fila de usuario
  const handleRowClick = (item: any) => {
    logService.log('info', 'Click en fila de usuario', { userId: item.id, item });
    navigate(`/users/${item.id}`);
  };

  // Manejar clic en una celda específica (por ejemplo, el rol)
  const handleCellClick = (item: any, column: any) => {
    logService.log('info', 'Click en celda de usuario', { 
      userId: item.id, 
      column: column.name,
      item 
    });

    if (column.name === 'role') {
      // Navegar a los detalles del rol
      const roleId = item.role_id;
      if (roleId) {
        logService.log('info', 'Navegando a detalles del rol', { roleId });
        navigate(`/roles/${roleId}`);
      } else {
        logService.log('warn', 'No se encontró role_id para el usuario', { item });
      }
    }
  };

  // Modificar el schema para hacer el rol clickeable
  const displaySchema = users.map(field => {
    if (field.name === 'role') {
      return { ...field, bdComponent: 'roles' };
    }
    return field;
  });

  logService.log('info', 'Renderizando página de usuarios', { 
    schemaFields: displaySchema.map(f => f.name) 
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de Usuarios
      </h1>
      
      <GenericPage
        entityName="Usuario"
        componentSchema={displaySchema}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
      />
    </div>
  );
};

export default Users;