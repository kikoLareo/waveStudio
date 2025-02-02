import React, { useState, useEffect } from 'react';
import { Plus, Minus, Users, Briefcase } from 'lucide-react';
import api from '../../services/api';
import logService from '../../utils/logService';
import { getComponents } from '../../services/componentService';

interface User {
  id: string;
  username: string;
}

interface JobPosition {
  id: string;
  title: string;
}

interface Assignment {
  user_id: string;
  job_position_id: string;
  hours_worked: number;
}

interface MultiAssignmentFormProps {
  championshipId: string;
  onSubmit: (assignments: Assignment[]) => void;
}

const MultiAssignmentForm: React.FC<MultiAssignmentFormProps> = ({
  championshipId,
  onSubmit
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([{
    user_id: '',
    job_position_id: '',
    hours_worked: 0
  }]);
  const [users, setUsers] = useState<User[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, jobPositionsRes] = await Promise.all([
          getComponents('users'),
          getComponents('job-positions')
        ]);

        setUsers(usersRes.data);
        setJobPositions(jobPositionsRes.data);
        logService.log('info', 'Datos del formulario múltiple cargados exitosamente');
      } catch (error) {
        logService.log('error', 'Error al cargar los datos del formulario múltiple', { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddAssignment = () => {
    setAssignments([
      ...assignments,
      { user_id: '', job_position_id: '', hours_worked: 0 }
    ]);
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[`assignment${index}`];
    setErrors(newErrors);
  };

  const handleChange = (index: number, field: keyof Assignment, value: string | number) => {
    const newAssignments = [...assignments];
    newAssignments[index] = {
      ...newAssignments[index],
      [field]: value
    };
    setAssignments(newAssignments);

    // Clear error for this field
    const newErrors = { ...errors };
    if (newErrors[`assignment${index}`]) {
      delete newErrors[`assignment${index}`];
      setErrors(newErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string[]> = {};
    
    assignments.forEach((assignment, index) => {
      const assignmentErrors: string[] = [];
      
      if (!assignment.user_id) {
        assignmentErrors.push('Seleccione un usuario');
      }
      if (!assignment.job_position_id) {
        assignmentErrors.push('Seleccione un puesto');
      }
      if (!assignment.hours_worked || assignment.hours_worked <= 0) {
        assignmentErrors.push('Ingrese horas válidas');
      }
      
      if (assignmentErrors.length > 0) {
        newErrors[`assignment${index}`] = assignmentErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(assignments);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <div className="mt-1 relative">
                  <select
                    value={assignment.user_id}
                    onChange={(e) => handleChange(index, 'user_id', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleccione un usuario</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                  <Users className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Puesto
                </label>
                <div className="mt-1 relative">
                  <select
                    value={assignment.job_position_id}
                    onChange={(e) => handleChange(index, 'job_position_id', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleccione un puesto</option>
                    {jobPositions.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                  <Briefcase className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horas
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={assignment.hours_worked}
                  onChange={(e) => handleChange(index, 'hours_worked', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {errors[`assignment${index}`] && (
              <div className="mt-2 text-sm text-red-600">
                {errors[`assignment${index}`].map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}

            {assignments.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveAssignment(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <Minus className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleAddAssignment}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Asignación
        </button>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Guardar Asignaciones
        </button>
      </div>
    </form>
  );
};

export default MultiAssignmentForm;