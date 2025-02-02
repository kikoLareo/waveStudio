import React from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';
import logService from '../../utils/logService';

interface Assignment {
  id: string;
  userId: string;
  userName: string;
  position: string;
  job_position_id: string;
  hoursWorked: number;
  status: string;
  startDate: string;
  endDate: string;
}

interface AssignmentsListProps {
  assignments: Assignment[];
}

const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments }) => {
  const navigate = useNavigate();

  const columns = [
    { name: 'userName', label: 'Usuario', bdComponent: 'users' },
    { name: 'position', label: 'Posición', bdComponent: 'job-positions' },
    { name: 'hoursWorked', label: 'Horas Trabajadas', type: 'number' },
    { name: 'status', label: 'Estado', type: 'text' },
    { name: 'period', label: 'Periodo', type: 'text' }
  ];

  const handleRowClick = (item: Assignment) => {
    logService.log('info', 'Click en fila de asignación', {
      assignmentId: item.id,
      item
    });
    navigate(`/assignments/${item.id}`);
  };

  const handleCellClick = (item: Assignment, column: any) => {
    logService.log('info', 'Click en celda de asignación', {
      assignmentId: item.id,
      column: column.name,
      bdComponent: column.bdComponent,
      item
    });

    if (column.bdComponent === 'users') {
      navigate(`/users/${item.userId}`);
    } else if (column.bdComponent === 'job-positions') {
      navigate(`/job-positions/${item.job_position_id}`);
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
    return {
      ...assignment,
      period: `${new Date(assignment.startDate).toLocaleDateString()} - ${new Date(assignment.endDate).toLocaleDateString()}`
    };
  });

  return (
    <Table
      columns={columns}
      data={processedData}
      onRowClick={handleRowClick}
      onCellClick={handleCellClick}
      showActions={false}
    />
  );
};

export default AssignmentsList;