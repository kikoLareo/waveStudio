import React from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FilterableTable from '../Table/FilterableTable';
import logService from '../../utils/logService';
import { SchemaField } from '../../schemas/schemas';

interface Assignment {
  id: string;
  userId: string;
  userName: string;
  position: string;
  hoursWorked: number;
  job_position_id?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface AssignmentsListProps {
  assignments: Assignment[];
}

const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments }) => {
  const navigate = useNavigate();

  const columns: SchemaField[] = [
    { name: 'userName', label: 'Usuario', type: 'bdComponent', required: false, bdComponent: 'users' },
    { name: 'position', label: 'Posición', type: 'bdComponent', required: false, bdComponent: 'job-positions' },
    { name: 'hoursWorked', label: 'Horas Trabajadas', type: 'number', required: false },
    { name: 'status', label: 'Estado', type: 'text', required: false },
    { name: 'period', label: 'Periodo', type: 'text', required: false }
  ];

  const handleRowClick = (item: Assignment) => {
    logService.log('info', 'Click en fila de asignación', {
      assignmentId: item.id,
      item
    });
    navigate(`/assignments/${item.id}`);
  };

  const handleView = (item: Assignment) => {
    navigate(`/assignments/${item.id}`);
  };

  const handleUserNavigation = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleJobPositionNavigation = (jobPositionId: string) => {
    if (jobPositionId) {
      navigate(`/job-positions/${jobPositionId}`);
    }
  };

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Sin asignaciones</h3>
        <p className="mt-1 text-sm text-gray-500">
          No hay trabajadores asignados a este campeonato.
        </p>
      </div>
    );
  }

  // Procesar los datos para incluir el período formateado
  const processedData = assignments.map(assignment => {
    logService.log('debug', 'Procesando asignación', { assignment });
    
    // Usar fechas por defecto si no están disponibles
    const startDate = assignment.startDate ? new Date(assignment.startDate) : new Date();
    const endDate = assignment.endDate ? new Date(assignment.endDate) : new Date();
    
    return {
      ...assignment,
      status: assignment.status || 'Activo',
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    };
  });

  // Definir los filtros para la tabla
  const filters = [
    {
      field: 'status',
      type: 'select' as const,
      label: 'Estado',
      options: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' }
      ]
    },
    {
      field: 'userName',
      type: 'text' as const,
      label: 'Usuario'
    },
    {
      field: 'startDate',
      type: 'date-range' as const,
      label: 'Fecha de inicio'
    }
  ];

  return (
    <FilterableTable
      columns={columns}
      data={processedData}
      onRowClick={handleRowClick}
      onView={handleView}
      showActions={true}
      filters={filters}
    />
  );
};

export default AssignmentsList;
