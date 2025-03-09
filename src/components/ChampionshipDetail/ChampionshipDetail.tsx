import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Award, DollarSign, ClipboardList, UserPlus, X } from 'lucide-react';
import { AsyncBoundary } from '../../boundary';
import { useChampionship } from '../../hooks/useChampionship';
import AssignmentsList from './AssignmentsList';
import CostsSummary from './CostsSummary';
import AddAssignmentForm from '../Form/AddAssignmentForm';
import Breadcrumbs from '../Breadcrumbs';

interface Assignment {
  id: string;
  userId: string;
  userName: string;
  position: string;
  job_position_id: string;
  hoursWorked: number;
  status: string;
  startDate: string;
  endDate: string;
}

const ChampionshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { championship, isLoading, error } = useChampionship(id);
  const [activeTab, setActiveTab] = useState<'info' | 'assignments' | 'costs'>('info');
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: 'info', label: 'Información', icon: Award },
    { id: 'assignments', label: 'Asignaciones', icon: ClipboardList },
    { id: 'costs', label: 'Costos', icon: DollarSign },
  ] as const;

  const handleAddPersonnelSuccess = () => {
    setShowAddPersonnel(false);
    // Trigger a refresh by updating the key
    setRefreshKey(prev => prev + 1);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'assignments':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Asignaciones</h2>
              <button
                onClick={() => setShowAddPersonnel(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Añadir Personal
              </button>
            </div>
            <AssignmentsList assignments={championship?.assignments || []} />
          </div>
        );
      case 'costs':
        return <CostsSummary championshipId={id} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InfoCard
              icon={MapPin}
              label="Ubicación"
              value={championship?.location}
            />
            <InfoCard
              icon={Award}
              label="Disciplina"
              value={championship?.discipline}
            />
            <InfoCard
              icon={Users}
              label="Organizador"
              value={championship?.organizer}
            />
            <InfoCard
              icon={Calendar}
              label="Fechas"
              value={`${new Date(championship?.startDate || '').toLocaleDateString()} - 
                     ${new Date(championship?.endDate || '').toLocaleDateString()}`}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal para añadir personal */}
      {showAddPersonnel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={() => setShowAddPersonnel(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Cerrar</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <AddAssignmentForm
                  championshipId={id || ''}
                  onSuccess={handleAddPersonnelSuccess}
                  onCancel={() => setShowAddPersonnel(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumbs 
            items={[
              { label: 'Campeonatos', path: '/championships' },
              { label: championship?.name || 'Detalle de Campeonato', path: `/championships/${id}` }
            ]} 
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {championship?.name}
            </h1>
          </div>

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

          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  value?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <div className="flex items-center">
      <Icon className="h-6 w-6 text-blue-500" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const ChampionshipDetailWrapper: React.FC = () => (
  <AsyncBoundary>
    <ChampionshipDetail />
  </AsyncBoundary>
);

export default ChampionshipDetailWrapper;
