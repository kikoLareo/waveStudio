import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Award,
  Clock,
  DollarSign,
  Briefcase,
  Target,
  Building2,
  Trophy,
  Medal
} from 'lucide-react';
import api from '../services/api';
import logService from '../utils/logService';

interface Assignment {
  id: string;
  userId: string;
  userName: string;
  position: string;
  hoursWorked: number;
  startDate: string;
  endDate: string;
  status: string;
  hourlyRate: number;
}

interface ChampionshipData {
  id: string;
  name: string;
  location: string;
  organizer: string;
  discipline: string;
  startDate: string;
  endDate: string;
  description?: string;
  maxParticipants?: number;
  status?: string;
  assignments?: Assignment[];
}

type TabType = 'info' | 'staff' | 'results';

const ChampionshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [championship, setChampionship] = useState<ChampionshipData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampionshipDetails = async () => {
      try {
        const response = await api.get(`/championships/${id}`);
        setChampionship(response.data);
        logService.log('info', `Detalles del campeonato ${id} obtenidos exitosamente`);
      } catch (error) {
        const errorMessage = 'Error al obtener los detalles del campeonato';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChampionshipDetails();
    }
  }, [id]);

  const tabs = [
    { id: 'info', label: 'Información General', icon: Trophy },
    { id: 'staff', label: 'Personal', icon: Users },
    { id: 'results', label: 'Resultados', icon: Medal }
  ] as const;

  const calculateTotalCost = () => {
    if (!championship?.assignments) return 0;
    return championship.assignments.reduce((total, assignment) => {
      return total + (assignment.hoursWorked * (assignment.hourlyRate || 0));
    }, 0);
  };

  const calculateTotalHours = () => {
    if (!championship?.assignments) return 0;
    return championship.assignments.reduce((total, assignment) => {
      return total + assignment.hoursWorked;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!championship) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative">
          No se encontró el campeonato
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <>
            {/* Información General */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Información General</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="text-gray-900 font-medium">{championship.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Target className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Disciplina</p>
                    <p className="text-gray-900 font-medium">{championship.discipline}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Organizador</p>
                    <p className="text-gray-900 font-medium">{championship.organizer}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Participantes Máximos</p>
                    <p className="text-gray-900 font-medium">{championship.maxParticipants || 'Sin límite'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas y Duración */}
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Fechas y Duración</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Inicio</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(championship.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Fin</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(championship.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duración</p>
                    <p className="text-gray-900 font-medium">
                      {Math.ceil((new Date(championship.endDate).getTime() - new Date(championship.startDate).getTime()) / (1000 * 60 * 60 * 24))} días
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'staff':
        return championship.assignments && championship.assignments.length > 0 ? (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Personal</p>
                  <p className="text-gray-900 font-medium">{championship.assignments.length}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Horas</p>
                  <p className="text-gray-900 font-medium">{calculateTotalHours()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Costo Total</p>
                  <p className="text-gray-900 font-medium">
                    ${calculateTotalCost().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periodo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {championship.assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{assignment.position}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{assignment.hoursWorked}h</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${assignment.status === 'Activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }
                        `}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(assignment.startDate).toLocaleDateString()} - 
                        {new Date(assignment.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No hay personal asignado a este campeonato
          </div>
        );

      case 'results':
        return (
          <div className="p-8 text-center text-gray-500">
            Los resultados estarán disponibles una vez finalizado el campeonato
          </div>
        );

      default:
        return null;
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">{championship.name}</h1>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${championship.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
            `}>
              {championship.status || 'Planificación'}
            </span>
          </div>
          {championship.description && (
            <p className="text-gray-600 mt-2">{championship.description}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`
                  mr-2 h-4 w-4
                  ${activeTab === id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
                />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de la pestaña activa */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ChampionshipDetail;