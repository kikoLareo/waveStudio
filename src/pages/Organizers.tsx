import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericPage from './GenericPage';
import { organizers } from '../schemas/schemas';

const OrganizerPage: React.FC = () => {
  const navigate = useNavigate();

  // Manejar clic en una fila de rol
  const handleRowClick = (item: any) => {
    navigate(`/organizer/${item.id}`);
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de Organizadores
      </h1>
      
      <GenericPage
        entityName="Organizador"
        componentSchema={organizers}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default OrganizerPage;