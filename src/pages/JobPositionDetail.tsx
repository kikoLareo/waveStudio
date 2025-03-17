import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComponentById } from '../services/componentService';
import { 
  ArrowLeft,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  FileText,
  Calendar,
  Edit,
  Trophy
} from 'lucide-react';
import api from '../services/api';
import logService from '../utils/logService';
import { useAuth } from '../context/AuthContext';

interface Assignment {
  id: string;
  user_id: string;
  username: string;
  championship_id: string;
  championship_name: string;
  job_position_id: string;
  job_position_name: string;
  hours_worked: number;
  status: string;
  start_date: string;
  end_date: string;
}

interface JobPositionData {
  id: string;
  title: string;
  description: string;
  cost_per_day: number;
  cost_per_hour: number;
  minHours: number;
  maxHours: number;
  requirements: string;
  createdAt: string;
  updatedAt: string;
  assignments?: Assignment[];
}

const JobPositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [position, setPosition] = useState<JobPositionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const canEdit = hasRole(1) || hasRole(2);

  useEffect(() => {
    const fetchPositionDetails = async () => {
      try {
        if (!id) {
          throw new Error('ID is undefined');
        }
        const response = await getComponentById(`job-positions`, id);
        setPosition(response.data);

        const assignments = await api.get(`/assignments/job/${id}`);
        setPosition((prev) => prev ? { ...prev, assignments: assignments.data } : null);
        logService.log('info', `Detalles del puesto ${id} obtenidos exitosamente`);
      } catch (error) {
        const errorMessage = 'Error al obtener los detalles del puesto';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPositionDetails();
    }
  }, [id]);

  const handleEditSave = async () => {
    try {
      if (!position) {
        throw new Error('Position is undefined');
      }
      await api.put(`/job-positions/update/${position.id}`, position);
      setEditMode(false);
      logService.log('info', `Puesto de trabajo ${position.id} actualizado`);
    } catch (error) {
      const errorMessage = 'Error al actualizar el puesto de trabajo';
      setError(errorMessage);
      logService.log('error', errorMessage, { error });
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleChampionshipClick = (championshipId: string) => {
    navigate(`/championships/${championshipId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !position) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error || 'No se encontró el puesto de trabajo'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{position.title}</h1>
                <p className="text-gray-500">{position.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setEditMode(true)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Detalles del Puesto */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Tarifa por Dia</p>
                {editMode ? (
                  <input
                    type="number"
                    value={position.cost_per_day}
                    className="text-lg font-semibold text-gray-900"
                    onChange={(e) => {
                      const newCostPerDay = +e.target.value;
                      setPosition((prev) => prev ? { 
                        ...prev, 
                        cost_per_day: newCostPerDay,
                        cost_per_hour: newCostPerDay / 8 
                      } : null)
                    }}
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">
                    ${position.cost_per_day}/dia
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Tarifa por Hora</p>
                {editMode ? (
                  <input
                    type="number"
                    value={position.cost_per_hour}
                    className="text-lg font-semibold text-gray-900"
                    onChange={(e) => setPosition((prev) => prev ? { ...prev, cost_per_hour: +e.target.value } : null)}
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">
                    ${position.cost_per_hour}/h
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Requisitos */}
        {position.requirements && (
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              Requisitos
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line">
                {position.requirements}
              </p>
            </div>
          </div>
        )}

        {/* Asignaciones */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Asignaciones Actuales</h2>
          
          {position.assignments && position.assignments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campeonato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periodo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {position.assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleUserClick(assignment.user_id)}
                        >
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleChampionshipClick(assignment.championship_id)}
                        >
                          <Trophy className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {assignment.championship_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{assignment.hours_worked}h</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(assignment.start_date).toLocaleDateString()} - 
                        {new Date(assignment.end_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {editMode && (
                <div className="mt-6">
                  <button
                    onClick={handleEditSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              )
                  }
            </div>

          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay asignaciones para este puesto
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPositionDetail;