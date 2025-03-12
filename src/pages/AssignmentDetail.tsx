import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComponentById } from '../services/componentService';

import { 
  ArrowLeft,
  Shield,
  Edit,
  Calendar,
  Phone,
  Mail,
  Globe,
  MapPin,
  User,
} from 'lucide-react';
import api from '../services/api';
import logService from '../utils/logService';
import { useAuth } from '../context/AuthContext';
import SelectWithSearch from '../components/Form/SelectWithSearch';

interface AssignmentData {
  id: string;
  username: string;
  championship_name: string;
  job_position_name: string;
  hours_worked: number;
  start_date: string;
  end_date: string;
}

interface User {
  id: string;
  username: string; 
}

interface JobPosition {
  id: string;
  title: string;
}

interface Championship {
  id: string;
  name: string;
}

const AssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { hasRole } = useAuth();
  const [formData, setFormData] = useState({
    user_id: '',
    job_position_id: '',
    championship_id: '',
    hours_worked: 0,
    start_date: '',
    end_date: ''
  });

  const canEdit =  hasRole(1) || hasRole(2);
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        if (!id) {
          throw new Error('ID is undefined');
        }
        const response = await getComponentById(`assignments`, id);
        setAssignment(response.data);
        logService.log('info', `Detalles del organizador ${id} obtenidos exitosamente`);
      } catch (error) {
        const errorMessage = 'Error al obtener los detalles del organizador';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssignmentDetails();
    }
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('users');
        setUsers(response.data);
        logService.log('info', 'Usuarios obtenidos exitosamente');
      } catch (error) {
        const errorMessage = 'Error al obtener los usuarios';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      }
    };

    const fetchJobPositions = async () => {
      try {
        const response = await api.get('job-positions');
        setJobPositions(response.data);
        logService.log('info', 'Puestos de trabajo obtenidos exitosamente');
      } catch (error) {
        const errorMessage = 'Error al obtener los puestos de trabajo';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      }
    };

    const fetchChampionships = async () => {
      try {
        const response = await api.get('championships');
        setChampionships(response.data);
        logService.log('info', 'Campeonatos obtenidos exitosamente');
      } catch (error) {
        const errorMessage = 'Error al obtener los campeonatos';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      }
    };

    if (canEdit) {
      fetchUsers();
      fetchJobPositions();
      fetchChampionships();
    }
  }
  , []);


  const handleSelectChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  const handleEdit = async () => {
    try {
      await api.put(`assignments/${id}/update`, assignment);
      logService.log('info', `Organizador ${id} actualizado exitosamente`);
      setEditMode(false);
    } catch (error) {
      const errorMessage = 'Error al actualizar el organizador';
      setError(errorMessage);
      logService.log('error', errorMessage, { error });
    }
  }

  if (error || !assignment) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'No se encontró el organizador'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </button>
  
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado */}
        <div className="p-8 border-b border-gray-200 flex justify-between items-start">
          
          {/* Campos principales en grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Usuario */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-500">Usuario</label>
              {editMode ? (
                <SelectWithSearch
                  options={users.map(user => ({ value: user.id, label: user.username }))}
                  value={formData.user_id}
                  onChange={(value) => handleSelectChange('user_id', value)}
                  placeholder="Seleccionar usuario"
                  icon={<User className="h-4 w-4 text-gray-400" />}
                />
              ) : (
                <h1 className="text-lg font-semibold text-gray-900">{assignment.username}</h1>
              )}
            </div>
  
            {/* Campeonato */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-500">Campeonato</label>
              {editMode ? (
                <SelectWithSearch
                  options={championships.map(championship => ({ value: championship.id, label: championship.name }))}
                  value={formData.championship_id}
                  onChange={(value) => handleSelectChange('championship_id', value)}
                  placeholder="Seleccionar campeonato"
                  icon={<Shield className="h-4 w-4 text-gray-400" />}
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">{assignment.championship_name}</p>
              )}
            </div>
  
            {/* Puesto de trabajo */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-500">Puesto de trabajo</label>
              {editMode ? (
                <SelectWithSearch
                  options={jobPositions.map(jobPosition => ({ value: jobPosition.id, label: jobPosition.title }))}
                  value={formData.job_position_id}
                  onChange={(value) => handleSelectChange('job_position_id', value)}
                  placeholder="Seleccionar puesto de trabajo"
                  icon={<Shield className="h-4 w-4 text-gray-400" />}
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">{assignment.job_position_name}</p>
              )}
            </div>
          </div>
  
          {/* Botón de Editar */}
          {canEdit && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-2 text-gray-400 hover:text-gray-600 ml-4"
            >
              <Edit className="h-5 w-5" />
            </button>
          )}
        </div>
  
        {/* Detalles adicionales (si los hay) */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Contenido adicional aquí */}
          </div>
        </div>
  
        {/* Botón Guardar Cambios en modo edición */}
        {editMode && (
          <div className="p-8 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleEdit}
            >
              Guardar Cambios
            </button>
          </div>
        )}
  
        {/* Información adicional: Fechas */}
        <div className="p-8 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Fecha de inicio */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Fecha de inicio</p>
                <p className="text-gray-900">
                  {assignment.start_date ? new Date(assignment.start_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
  
            {/* Fecha de finalización */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Fecha de finalización</p>
                <p className="text-gray-900">
                  {assignment.end_date ? new Date(assignment.end_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    </div>
  );
};  

export default AssignmentDetail;
