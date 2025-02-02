import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericPage from './GenericPage';
import { championships } from '../schemas/schemas';
import logService from '../utils/logService';

const ChampionshipsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRowClick = (item: any) => {
    logService.log('info', 'Click en fila de campeonato', { 
      championshipId: item.id,
      item 
    });
    navigate(`/championships/${item.id}`);
  };

  const handleCellClick = (item: any, column: any) => {
    logService.log('info', 'Click en celda de campeonato', {
      championshipId: item.id,
      column: column.name,
      bdComponent: column.bdComponent,
      item
    });

    // Verificar que tengamos el ID antes de navegar
    if (column.bdComponent === 'organizers' && item.organizer_id) {
      navigate(`/organizers/${item.organizer_id}`);
    } else if (column.bdComponent === 'disciplines' && item.discipline_id) {
      navigate(`/disciplines/${item.discipline_id}`);
    } else {
      logService.log('warn', 'ID no encontrado para navegación', {
        component: column.bdComponent,
        item
      });
      // Si no hay ID, navegar a la lista general
      navigate(`/${column.bdComponent}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de Campeonatos
      </h1>
      
      <GenericPage
        entityName="Campeonato"
        componentSchema={championships}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
      />
    </div>
  );
};

export default ChampionshipsPage;