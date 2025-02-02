import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Award, Users, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Campeonatos Activos', value: '12', icon: Award },
    { label: 'Usuarios Registrados', value: '156', icon: Users },
    { label: 'Eventos Este Mes', value: '8', icon: Calendar },
    { label: 'Asignaciones Pendientes', value: '23', icon: Activity },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Dashboard WaveStudio
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">{label}</h3>
              <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-2">
            <Link to="/championships/new" className="block p-3 rounded hover:bg-gray-50">
              Crear Nuevo Campeonato
            </Link>
            <Link to="/assignments/new" className="block p-3 rounded hover:bg-gray-50">
              Nueva Asignación
            </Link>
            <Link to="/users/new" className="block p-3 rounded hover:bg-gray-50">
              Registrar Usuario
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Próximos Eventos</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b">
                <div>
                  <h4 className="font-medium">Campeonato #{i}</h4>
                  <p className="text-sm text-gray-500">En 3 días</p>
                </div>
                <Link to={`/championships/${i}`} className="text-blue-500 hover:text-blue-600">
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;