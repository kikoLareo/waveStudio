import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComponentById } from '../services/componentService';
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
  Medal,
  Edit,
  Plus,
  Save,
  X
} from 'lucide-react';
import logService from '../utils/logService';
import api from '../services/api';
import DynamicForm from '../components/Form/DynamicForm';
import { returnSchema } from '../schemas/schemas';
import Modal from '../components/Modal/Modal';
import { useAuth } from '../context/AuthContext';
import {DynamicSelect} from '../components/DynamicSelect/DynamicSelect';

interface Assignment {
  id: number;
  userId: string;
  username: string;
  job_position_name: string;
  hours_worked: number;
  start_date: string;
  end_date: string;
  status: string;
  hourlyRate: number;
}

interface Result {
  id: number;
  position: number;
  athleteName: string;
  country: string;
  score: number;
  notes?: string;
}

interface ChampionshipData {
  id: number;
  name: string;
  location: string;
  organizer_id: number;
  organizer_name: string;
  discipline_id: number;
  discipline_name: string;
  start_date: string;
  end_date: string;
  description?: string;
  maxParticipants?: number;
  status?: string;
  assignments?: Assignment[];
  results?: Result[];
}

type TabType = 'info' | 'staff' | 'results';

const ChampionshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [championship, setChampionship] = useState<ChampionshipData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ChampionshipData> | null>(null);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddResultModal, setShowAddResultModal] = useState(false);
  const { hasRole } = useAuth();
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);

  // Verificar si el usuario tiene permisos de edición
  const canEdit = hasRole(1) || hasRole(2); // Asumiendo que los roles 1 (master) y 2 (editor) tienen permisos de edición
  const fetchAssignmentData = async (championshipId: number) => {
    try {
      if (!championship) {
        throw new Error('Championship is null');
      }
  
      const response = await api.get(`/assignments/championship/${championshipId}`);
      const assignments = response.data;

  
      logService.log('info', 'Detalles de la asignación obtenidos exitosamente', { assignments: assignments });
  
      // Actualizamos el championship con las assignments completas
      setChampionship(prevChampionship => prevChampionship ? {
        ...prevChampionship,
        assignments: assignments
      } : prevChampionship);
  
      return assignments;
    } catch (error) {
      logService.log('error', 'Error al obtener los detalles de la asignación', { error });
      throw error;
    }
  };

  useEffect(() => {
    setIsEditing(false);
    setEditData(null);
  }
  , [activeTab]);
  

  useEffect(() => {
    const loadAssignments = async () => {
      if (activeTab === 'staff' && championship && !assignmentsLoaded) {
        await fetchAssignmentData(championship.id);
        setAssignmentsLoaded(true);
      }
    };
  
    loadAssignments();
  }, [activeTab, championship, assignmentsLoaded]);
  
  const fetchChampionshipDetails = async () => {
    setLoading(true);
    try {
      if (!id) {
        throw new Error('ID is undefined');
      }
      const response = await getComponentById(`championships`, id);
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

  useEffect(() => {
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
      return total + (assignment.hours_worked * (assignment.hourlyRate || 0));
    }, 0);
  };

  const calculateTotalHours = () => {
    if (!championship?.assignments) return 0;
    return championship.assignments.reduce((total, assignment) => {
      return total + assignment.hours_worked;
    }, 0);
  };



  const handleEditClick = () => {
    if (championship) {
      setEditData({
        name: championship.name,
        location: championship.location,
        organizer_id: championship.organizer_id,
        organizer_name: championship.organizer_name,
        discipline_id: championship.discipline_id,
        discipline_name: championship.discipline_name,
        start_date: championship.start_date,
        end_date: championship.end_date,
        description: championship.description,
        maxParticipants: championship.maxParticipants,
        status: championship.status
      });
      setIsEditing(!isEditing);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSaveChanges = async (formData: Partial<ChampionshipData>) => {
    try {
      if (!id) return;
      
      await api.put(`/championships/update/${id}`, formData);
      logService.log('info', `Campeonato ${id} actualizado exitosamente`);
      
      // Recargar los datos para mostrar los cambios
      await fetchChampionshipDetails();
      
      // Volver al modo visualización
      setIsEditing(false);
      setEditData(null);
    } catch (error) {
      logService.log('error', 'Error al actualizar el campeonato', { error });
      throw error;
    }
  };

  const handleAddStaff = async (formData: any) => {
    try {
      if (!id) return;
      
      // Añadir el ID del campeonato al formulario
      formData.championship_id = id;
      
      await api.post('/assignments/create', formData);
      logService.log('info', 'Personal añadido exitosamente al campeonato', { championshipId: id });
      
      // Recargar los datos para mostrar los cambios
      await fetchChampionshipDetails();
      
      // Cerrar el modal
      setShowAddStaffModal(false);
    } catch (error) {
      logService.log('error', 'Error al añadir personal al campeonato', { error });
      throw error;
    }
  };

  const handleAddResult = async (formData: any) => {
    try {
      if (!id) return;
      
      // Añadir el ID del campeonato al formulario
      formData.championship_id = id;
      
      // Esta es una implementación de ejemplo, ajustar según la API real
      await api.post('/championships/results', formData);
      logService.log('info', 'Resultado añadido exitosamente al campeonato', { championshipId: id });
      
      // Recargar los datos para mostrar los cambios
      await fetchChampionshipDetails();
      
      // Cerrar el modal
      setShowAddResultModal(false);
    } catch (error) {
      logService.log('error', 'Error al añadir resultado al campeonato', { error });
      throw error;
    }
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
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData?.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="text-gray-900 font-medium focus:outline-none background-gray-100 border-gray-200 border rounded-lg px-2 py-2"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{championship.location}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Target className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Disciplina</p>
                    {isEditing ? (
                      <DynamicSelect
                      resourceName="disciplines"
                      value={editData?.discipline_id ?? 0}
                      onChange={(value) => {
                        setEditData({
                          ...editData,
                          discipline_id: value.id,
                          discipline_name: value.name,});
                      }}
                      label="Disciplina"
                      placeholder="Seleccione una disciplina"
                      idField="id"
                      labelField="name"
                    />       
                    ) : (
                      <p className="text-gray-900 font-medium">{championship.discipline_name}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Organizador</p>
                    {isEditing ? (
                      <DynamicSelect
                      resourceName="organizers"
                      value={editData?.organizer_id ?? 0}
                      onChange={(selectedItem ) => {
                        logService.log('info', 'Organizador seleccionado', { selectedItem });
                        setEditData({
                          ...editData,
                          organizer_id: selectedItem.id,
                          organizer_name: selectedItem.name,
                        });
                      }}
                      label="Organizador"
                      placeholder="Seleccione un organizador"
                      idField="id"             // por defecto, podrías omitirlo
                      labelField="name"    // nombre de usuario
                    />
                    ) : (
                      <p className="text-gray-900 font-medium">{championship.organizer_name}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Participantes Máximos</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData?.maxParticipants}
                        onChange={(e) => setEditData({ ...editData, maxParticipants: parseInt(e.target.value, 10) || undefined })}
                        className="text-gray-900 font-medium focus:outline-none background-gray-100 border-gray-200 border rounded-lg px-4 py-2"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{championship.maxParticipants || 'Sin límite'}</p>
                    )}
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
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData?.start_date}
                        onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
                        className="text-gray-900 font-medium focus:outline-none background-gray-100 border-gray-200 border rounded-lg px-4 py-2"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {new Date(championship.start_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Fin</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData?.end_date}
                        onChange={(e) => setEditData({ ...editData, end_date: e.target.value })}
                        className="text-gray-900 font-medium focus:outline-none background-gray-100 border-gray-200 border rounded-lg px-4 py-2"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {new Date(championship.end_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duración</p>
                    <p className="text-gray-900 font-medium">
                      {Math.max(1, (Math.ceil((new Date(championship.end_date).getTime() - new Date(championship.start_date).getTime()) / (1000 * 60 * 60 * 24))) +1)} días
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="p-8 flex justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md mr-4 flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={() => handleSaveChanges(editData || {})}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </button>
              </div>
            )}
          </>
        );

      case 'staff':
        return (
          <div className="p-8">
            {/* Botón para añadir personal */}
            {canEdit && (
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Personal
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Personal</p>
                  <p className="text-gray-900 font-medium">{championship.assignments?.length || 0}</p>
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

            {championship.assignments && championship.assignments.length > 0 ? (
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
                                {assignment.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{assignment.job_position_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{assignment.hours_worked}h</span>
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
                          {assignment.start_date && new Date(assignment.start_date).toLocaleDateString()} - 
                          { assignment.end_date && new Date(assignment.end_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay personal asignado a este campeonato
              </div>
            )}
          </div>
        );

      case 'results':
        return (
          <div className="p-8">
            {/* Botón para añadir resultados */}
            {canEdit && (
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowAddResultModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Resultado
                </button>
              </div>
            )}
            
            {championship.results && championship.results.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posición
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Atleta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        País
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Puntuación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {championship.results.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-800 font-bold">{result.position}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{result.athleteName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{result.country}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{result.score}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay resultados registrados para este campeonato
              </div>
            )}
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
            {isEditing && (
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Editando campeonato</h1>
            )}
            <div className="flex items-center justify-between mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.name}
                  autoFocus
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="text-3xl font-bold text-gray-900 focus:outline-none background-gray-100 border-gray-200 border rounded-lg px-4 py-2"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{championship.name}</h1>
              )}
              <div className="flex items-center space-x-2">
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${championship.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                `}>
                  {championship.status || 'Planificación'}
                </span>
                {canEdit && (
                  <button
                    onClick={handleEditClick}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
              </div>
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

      {/* Modal para añadir personal */}
      <Modal
        isOpen={showAddStaffModal}
        onClose={() => setShowAddStaffModal(false)}
        title="Añadir Personal al Campeonato"
      >
        <DynamicForm
          schema={returnSchema('championshipAssignments').filter(field => 
            ['user_id', 'job_position_id', 'hours_worked'].includes(field.name)
          )}
          onSubmit={handleAddStaff}
        />
      </Modal>

      {/* Modal para añadir resultados */}
      <Modal
        isOpen={showAddResultModal}
        onClose={() => setShowAddResultModal(false)}
        title="Añadir Resultado al Campeonato"
      >
        <DynamicForm
          schema={[
            { name: 'position', label: 'Posición', type: 'number', required: true },
            { name: 'athleteName', label: 'Nombre del Atleta', type: 'text', required: true },
            { name: 'country', label: 'País', type: 'text', required: true },
            { name: 'score', label: 'Puntuación', type: 'number', required: true },
            { name: 'notes', label: 'Notas', type: 'text', required: false }
          ]}
          onSubmit={handleAddResult}
        />
      </Modal>
    </div>
  );
};

export default ChampionshipDetail;
