import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericPage from './GenericPage';
import { roles } from '../schemas/schemas';

const RolesPage: React.FC = () => {
  const navigate = useNavigate();

  // Manejar clic en una fila de rol
  const handleRowClick = (item: any) => {
    navigate(`/roles/${item.id}`);
  };

  // Manejar clic en una celda específica si es necesario
  const handleCellClick = (item: any, column: any) => {
    if (column.name === 'userCount') {
      // Si se hace clic en el contador de usuarios, podríamos navegar a una vista filtrada de usuarios
      navigate(`/users?role=${item.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de Roles
      </h1>
      
      <GenericPage
        entityName="Rol"
        componentSchema={roles}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
      />
    </div>
  );
};

export default RolesPage;