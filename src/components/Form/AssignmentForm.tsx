import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Clock } from 'lucide-react';
import api from '../../services/api';
import logService from '../../utils/logService';
import { getComponents } from '../../services/componentService';

interface User {
  id: string;
  username: string;
}

interface Championship {
  id: string;
  name: string;
}

interface JobPosition {
  id: string;
  title: string;
}

interface AssignmentFormData {
  user_id: string;
  championship_id: string;
  job_position_id: string;
  hours_worked: number;
}

interface AssignmentFormProps {
  initialData?: Partial<AssignmentFormData>;
  onSubmit: (data: AssignmentFormData) => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  initialData = {},
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<AssignmentFormData>>(initialData);
  const [users, setUsers] = useState<User[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof AssignmentFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, championshipsRes, jobPositionsRes] = await Promise.all([
          getComponents('users'),
          getComponents('championships'),
          getComponents('job-positions'),
        ]);

        setUsers(usersRes.data);
        setChampionships(championshipsRes.data);
        setJobPositions(jobPositionsRes.data);
        logService.log('info', 'Datos del formulario cargados exitosamente');
      } catch (error) {
        logService.log('error', 'Error al cargar los datos del formulario', { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AssignmentFormData, string>> = {};
    
    if (!formData.user_id) {
      newErrors.user_id = 'Seleccione un usuario';
    }
    if (!formData.championship_id) {
      newErrors.championship_id = 'Seleccione un campeonato';
    }
    if (!formData.job_position_id) {
      newErrors.job_position_id = 'Seleccione un puesto';
    }
    if (!formData.hours_worked || formData.hours_worked <= 0) {
      newErrors.hours_worked = 'Ingrese un número válido de horas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as AssignmentFormData);
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
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Usuario
        </label>
        <div className="mt-1 relative">
          <select
            name="user_id"
            value={formData.user_id || ''}
            onChange={handleChange}
            className={`
              block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${errors.user_id ? 'border-red-300' : 'border-gray-300'}
            `}
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
        {errors.user_id && (
          <p className="mt-2 text-sm text-red-600">{errors.user_id}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Campeonato
        </label>
        <div className="mt-1 relative">
          <select
            name="championship_id"
            value={formData.championship_id || ''}
            onChange={handleChange}
            className={`
              block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${errors.championship_id ? 'border-red-300' : 'border-gray-300'}
            `}
          >
            <option value="">Seleccione un campeonato</option>
            {championships.map((championship) => (
              <option key={championship.id} value={championship.id}>
                {championship.name}
              </option>
            ))}
          </select>
          <Briefcase className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.championship_id && (
          <p className="mt-2 text-sm text-red-600">{errors.championship_id}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Puesto de Trabajo
        </label>
        <div className="mt-1 relative">
          <select
            name="job_position_id"
            value={formData.job_position_id || ''}
            onChange={handleChange}
            className={`
              block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${errors.job_position_id ? 'border-red-300' : 'border-gray-300'}
            `}
          >
            <option value="">Seleccione un puesto de trabajo</option>
            {jobPositions.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.job_position_id && (
          <p className="mt-2 text-sm text-red-600">{errors.job_position_id}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Horas Trabajadas
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="hours_worked"
            value={formData.hours_worked || ''}
            onChange={handleChange}
            min="0"
            step="0.5"
            className={`
              block w-full rounded-md shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${errors.hours_worked ? 'border-red-300' : 'border-gray-300'}
            `}
            placeholder="Ingrese las horas trabajadas"
          />
        </div>
        {errors.hours_worked && (
          <p className="mt-2 text-sm text-red-600">{errors.hours_worked}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar Asignación
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;