import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../services/api';
import { Calendar, Users, Award, Clock, TrendingUp, ExternalLink } from 'lucide-react';

interface Championship {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  organizer_id: number;
  discipline_id: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
}

interface Assignment {
  user_id: number;
  championship_id: number;
  job_position_id: number;
  hours_worked: number;
  start_date?: string;
  end_date?: string;
}

interface DashboardData {
  championships: Championship[];
  users: User[];
  assignments: Assignment[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData>({ championships: [], users: [], assignments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchDashboardData();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getUpcomingChampionships = () => {
    const today = new Date();
    return data.championships
      .filter(championship => new Date(championship.start_date) > today)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 5);
  };

  const getUpcomingAssignments = () => {
    const today = new Date();
    // Filter assignments with start_date in the future
    const upcomingAssignments = data.assignments
      .filter(assignment => assignment.start_date && new Date(assignment.start_date) > today)
      .sort((a, b) => {
        if (!a.start_date || !b.start_date) return 0;
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      })
      .slice(0, 5);
    
    // Enrich assignments with championship and user data
    return upcomingAssignments.map(assignment => {
      const championship = data.championships.find(c => c.id === assignment.championship_id);
      const user = data.users.find(u => u.id === assignment.user_id);
      return {
        ...assignment,
        championshipName: championship?.name || 'Desconocido',
        username: user?.username || 'Desconocido',
      };
    });
  };

  const getMostActiveUsers = () => {
    const userAssignmentCounts = data.users.map(user => {
      const assignmentCount = data.assignments.filter(a => a.user_id === user.id).length;
      return { ...user, assignmentCount };
    });
    
    return userAssignmentCounts
      .sort((a, b) => b.assignmentCount - a.assignmentCount)
      .slice(0, 5);
  };

  const getTotalHoursWorked = () => {
    return data.assignments.reduce((total, assignment) => total + assignment.hours_worked, 0);
  };

  const getAssignmentsByDateRange = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    
    const oneMonthAhead = new Date(now);
    oneMonthAhead.setMonth(now.getMonth() + 1);
    
    const past = data.assignments.filter(a => 
      a.end_date && new Date(a.end_date) < now && new Date(a.end_date) > oneMonthAgo
    ).length;
    
    const current = data.assignments.filter(a => 
      (a.start_date && new Date(a.start_date) <= now) && 
      (a.end_date && new Date(a.end_date) >= now)
    ).length;
    
    const future = data.assignments.filter(a => 
      a.start_date && new Date(a.start_date) > now && new Date(a.start_date) < oneMonthAhead
    ).length;
    
    return { past, current, future };
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" role="status">
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> Error al cargar datos del dashboard.</span>
    </div>
  );

  const upcomingChampionships = getUpcomingChampionships();
  const mostActiveUsers = getMostActiveUsers();
  const totalHoursWorked = getTotalHoursWorked();
  const upcomingAssignments = getUpcomingAssignments();
  const assignmentsByDateRange = getAssignmentsByDateRange();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Campeonatos</p>
            <p className="text-2xl font-bold">{data.championships.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Usuarios</p>
            <p className="text-2xl font-bold">{data.users.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Horas Trabajadas</p>
            <p className="text-2xl font-bold">{totalHoursWorked}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Asignaciones Activas</p>
            <p className="text-2xl font-bold">{assignmentsByDateRange.current}</p>
          </div>
        </div>
      </div>
      
      {/* Upcoming Championships */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Próximos Campeonatos
          </h2>
        </div>
        <div className="p-6">
          {upcomingChampionships.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingChampionships.map(championship => (
                    <tr key={championship.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link 
                          to={`/championships/${championship.id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          {championship.name}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{championship.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(championship.start_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(championship.end_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay campeonatos próximos</p>
          )}
        </div>
      </div>
      
      {/* Upcoming Assignments */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-amber-600" />
            Próximas Asignaciones
          </h2>
        </div>
        <div className="p-6">
          {upcomingAssignments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campeonato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingAssignments.map((assignment, index) => (
                    <tr key={`${assignment.user_id}-${assignment.championship_id}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link 
                          to={`/users/${assignment.user_id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          {assignment.username}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link 
                          to={`/championships/${assignment.championship_id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          {assignment.championshipName}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.start_date ? new Date(assignment.start_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.end_date ? new Date(assignment.end_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.hours_worked}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay asignaciones próximas</p>
          )}
        </div>
      </div>

      {/* Assignment Timeline */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Distribución de Asignaciones
          </h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-center p-4 bg-gray-50 rounded-lg flex-1 mx-2">
              <p className="text-gray-500 text-sm">Último Mes</p>
              <p className="text-2xl font-bold text-blue-600">{assignmentsByDateRange.past}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg flex-1 mx-2">
              <p className="text-gray-500 text-sm">Actuales</p>
              <p className="text-2xl font-bold text-green-600">{assignmentsByDateRange.current}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg flex-1 mx-2">
              <p className="text-gray-500 text-sm">Próximo Mes</p>
              <p className="text-2xl font-bold text-amber-600">{assignmentsByDateRange.future}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Most Active Users */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Usuarios Más Activos
          </h2>
        </div>
        <div className="p-6">
          {mostActiveUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignaciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mostActiveUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link 
                          to={`/users/${user.id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          {user.username}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.assignmentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay usuarios con asignaciones</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
