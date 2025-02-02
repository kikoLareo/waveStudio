import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Award, DollarSign, ClipboardList, ChevronDown } from 'lucide-react';
import { AsyncBoundary } from '../../boundary';
import { useChampionship } from '../../hooks/useChampionship';
import AssignmentsList from './AssignmentsList';
import CostsSummary from './CostsSummary';

const ChampionshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { championship, isLoading, error } = useChampionship(id);
  const [activeTab, setActiveTab] = useState<'info' | 'assignments' | 'costs'>('info');

  const tabs = [
    { id: 'info', label: 'Información', icon: Award },
    { id: 'assignments', label: 'Asignaciones', icon: ClipboardList },
    { id: 'costs', label: 'Costos', icon: DollarSign },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'assignments':
        return <AssignmentsList assignments={championship?.assignments || []} />;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver a Campeonatos
        </button>

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