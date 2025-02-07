import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericPage from './GenericPage';
import { jobPositions } from '../schemas/schemas';

const JobPositionsPage: React.FC = () => {
  const navigate = useNavigate();

  // Manejar clic en una fila de puesto de trabajo
  const handleRowClick = (item: any) => {
    navigate(`/job-positions/${item.id}`);
  };

  // Manejar clic en una celda específica si es necesario
  const handleCellClick = (item: any, column: any) => {
    // Por ejemplo, si tienes una columna que muestra el número de asignaciones
    if (column.name === 'assignmentCount') {
      navigate(`/assignments?position=${item.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de Puestos de Trabajo
      </h1>
      
      <GenericPage
        entityId='job-positions'
        entityName="Puesto de Trabajo"
        componentSchema={jobPositions}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
      />
    </div>
  );
};

export default JobPositionsPage;