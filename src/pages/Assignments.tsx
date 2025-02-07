import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Briefcase } from 'lucide-react';
import { championshipAssignments } from '../schemas/schemas';
import GenericPage from './GenericPage';

interface Assignment {
  id: string;
  user_id: string;
  championship_id: string;
  job_position_id: string;
  hours_worked: number;
  userName: string;
  championshipName: string;
  positionTitle: string;
  status: string;
}

type GroupBy = 'none' | 'user' | 'championship' | 'position';

const AssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const displaySchema = championshipAssignments.map(field => {
    if (field.name === 'user_id') {
      return { ...field, name: 'userName', label: 'Usuario' };
    }
    if (field.name === 'championship_id') {
      return { ...field, name: 'championshipName', label: 'Campeonato' };
    }
    if (field.name === 'job_position_id') {
      return { ...field, name: 'positionTitle', label: 'Puesto de Trabajo' };
    }
    return field;
  });

  const groupOptions = [
    { value: 'none', label: 'Sin agrupar' },
    { value: 'user', label: 'Por Usuario', icon: Users },
    { value: 'championship', label: 'Por Campeonato', icon: Trophy },
    { value: 'position', label: 'Por Puesto', icon: Briefcase }
  ];

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const groupAssignments = (assignments: Assignment[]) => {
    if (groupBy === 'none') return { 'Todas las asignaciones': assignments };

    return assignments.reduce((acc: Record<string, Assignment[]>, assignment) => {
      let key = '';

      switch (groupBy) {
        case 'user':
          key = assignment.userName || 'Sin usuario';
          break;
        case 'championship':
          key = assignment.championshipName || 'Sin campeonato';
          break;
        case 'position':
          key = assignment.positionTitle || 'Sin puesto';
          break;
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(assignment);
      return acc;
    }, {});
  };

  const handleRowClick = (item: Assignment) => {
    navigate(`/assignments/${item.id}`);
  };

  const handleRelatedClick = (type: string, id: string) => {
    switch (type) {
      case 'user':
        navigate(`/users/${id}`);
        break;
      case 'championship':
        navigate(`/championships/${id}`);
        break;
      case 'position':
        navigate(`/job-positions/${id}`);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Asignaciones
        </h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Agrupar por:
          </label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            className="
              block w-40 pl-3 pr-10 py-2 text-base
              border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500
              sm:text-sm rounded-md
            "
          >
            {groupOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <GenericPage
        entityId='assignments'
        entityName="Asignación"
        componentSchema={displaySchema}
        groupBy={groupBy}
        onToggleGroup={toggleGroup}
        expandedGroups={expandedGroups}
        transformData={groupAssignments}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default AssignmentsPage;