import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericPage from './GenericPage';
import { disciplines } from '../schemas/schemas';

const disciplinePage: React.FC = () => {
  const navigate = useNavigate();

  // Manejar clic en una fila de rol
  const handleRowClick = (item: any) => {
    navigate(`/discipline/${item.id}`);
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de Disciplinas
      </h1>
      
      <GenericPage
        entityId='disciplines'
        entityName="Disciplina"
        componentSchema={disciplines}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default disciplinePage;