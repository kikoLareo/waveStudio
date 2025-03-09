import React, { useState, useEffect } from 'react';
import { User, Briefcase, Calendar, Clock } from 'lucide-react';
import api from '../../services/api';
import logService from '../../utils/logService';
import SelectWithSearch from './SelectWithSearch';

interface AddAssignmentFormProps {
  championshipId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface User {
  id: string;
  username: string;
}

interface JobPosition {
  id: string;
  title: string;
}

const AddAssignmentForm: React.FC<AddAssignmentFormProps> = ({
  championshipId,
  onSuccess,
  onCancel
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [existingAssignments, setExistingAssignments] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    user_id: '',
    job_position_id: '',
    hours_worked: 0,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar usuarios
        const usersResponse = await api.get('/users');
        setUsers(usersResponse.data);
        
        // Cargar puestos de trabajo
        const jobPositionsResponse = await api.get('/job-positions');
        setJobPositions(jobPositionsResponse.data);
        
        // Cargar asignaciones existentes para validación
        const assignmentsResponse = await api.get('/assignments');
        setExistingAssignments(assignmentsResponse.data);
        
        // Establecer fechas por defecto (las del campeonato)
        if (championshipId) {
          const championshipResponse = await api.get(`/championships/${championshipId}`);
          const championship = championshipResponse.data;
          
          setFormData(prev => ({
            ...prev,
            start_date: championship.start_date,
            end_date: championship.end_date
          }));
        }
        
        setLoading(false);
      } catch (error) {
        setError('Error al cargar datos');
        logService.log('error', 'Error al cargar datos para el formulario de asignación', { error });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [championshipId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours_worked' ? parseInt(value) : value
    }));
    
    // Limpiar errores de validación al cambiar el valor
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores de validación al cambiar el valor
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validar campos requeridos
    if (!formData.user_id) {
      errors.user_id = 'El usuario es obligatorio';
    }
    
    if (!formData.job_position_id) {
      errors.job_position_id = 'El puesto de trabajo es obligatorio';
    }
    
    if (formData.hours_worked <= 0) {
      errors.hours_worked = 'Las horas trabajadas deben ser mayores que 0';
    }
    
    if (!formData.start_date) {
      errors.start_date = 'La fecha de inicio es obligatoria';
    }
    
    if (!formData.end_date) {
      errors.end_date = 'La fecha de fin es obligatoria';
    }
    
    // Validar que la fecha de fin sea posterior a la fecha de inicio
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate < startDate) {
        errors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }
    
    // Validar solapamientos para el mismo usuario
    if (formData.user_id && formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      const overlappingAssignment = existingAssignments.find(assignment => {
        if (assignment.user_id.toString() !== formData.user_id.toString()) {
          return false;
        }
        
        const assignmentStartDate = new Date(assignment.start_date);
        const assignmentEndDate = new Date(assignment.end_date);
        
        // Comprobar si hay solapamiento
        return (
          (startDate <= assignmentEndDate && endDate >= assignmentStartDate) ||
          (assignmentStartDate <= endDate && assignmentEndDate >= startDate)
        );
      });
      
      if (overlappingAssignment) {
        errors.user_id = 'Este usuario ya tiene una asignación en este periodo';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const assignmentData = {
        ...formData,
        championship_id: championshipId
      };
      
      await api.post('/assignments', assignmentData);
      
      logService.log('info', 'Asignación creada exitosamente', { 
        championshipId, 
        userId: formData.user_id 
      });
      
      onSuccess();
    } catch (error: any) {
      // Mejorar mensajes de error
      if (error.response && error.response.data && error.response.data.detail) {
        setError(`Error: ${error.response.data.detail}`);
      } else {
        setError('Error al crear la asignación. Por favor, inténtelo de nuevo.');
      }
      logService.log('error', 'Error al crear asignación', { error, formData });
      setLoading(false);
    }
  };

  if (loading && !users.length && !jobPositions.length) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Añadir Personal al Campeonato</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {Object.keys(validationErrors).length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
          <p className="font-medium mb-1">Por favor, corrija los siguientes errores:</p>
          <ul className="list-disc pl-5 space-y-1">
            {Object.values(validationErrors).map((errorMsg, index) => (
              <li key={index}>{errorMsg}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <SelectWithSearch
              options={users.map(user => ({ value: user.id, label: user.username }))}
              value={formData.user_id}
              onChange={(value) => handleSelectChange('user_id', value)}
              placeholder="Seleccionar usuario"
              icon={<User className="h-4 w-4 text-gray-400" />}
            />
            {validationErrors.user_id && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.user_id}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puesto de Trabajo
            </label>
            <SelectWithSearch
              options={jobPositions.map(position => ({ value: position.id, label: position.title }))}
              value={formData.job_position_id}
              onChange={(value) => handleSelectChange('job_position_id', value)}
              placeholder="Seleccionar puesto"
              icon={<Briefcase className="h-4 w-4 text-gray-400" />}
            />
            {validationErrors.job_position_id && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.job_position_id}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas Trabajadas
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                name="hours_worked"
                value={formData.hours_worked}
                onChange={handleChange}
                min="0"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  validationErrors.hours_worked ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
            </div>
            {validationErrors.hours_worked && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.hours_worked}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha de Inicio
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    validationErrors.start_date ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {validationErrors.start_date && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.start_date}</p>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="end_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha de Fin
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="end_date"
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    validationErrors.end_date ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {validationErrors.end_date && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.end_date}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAssignmentForm;
