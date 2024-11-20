import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import logService from '../utils/logger';

const ChampionshipDetailPage = () => {
  const { championshipId } = useParams(); // Asegúrate de que esto funcione correctamente
  const [championship, setChampionship] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChampionshipDetails = async () => {
      try {
        const response = await api.get(`/championships/${championshipId}`);
        setChampionship(response.data);
        logService.log('info', `Detalles del campeonato ${championshipId} obtenidos exitosamente`);
      } catch (error) {
        setError('Error al obtener los detalles del campeonato');
        logService.log('error', `Error al obtener los detalles del campeonato ${championshipId}`, error);
      }
    };

    if (championshipId) { // Solo intenta obtener detalles si championshipId es válido
      fetchChampionshipDetails();
    }
  }, [championshipId]);

  if (error) return <div className="error-message">{error}</div>;
  if (!championship) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{championship.name}</h1>
      <p><strong>Lugar:</strong> {championship.location}</p>
      <p><strong>Organizador:</strong> {championship.organizer}</p>
      <p><strong>Disciplina:</strong> {championship.discipline}</p>
      <p><strong>Fecha de inicio:</strong> {championship.startDate}</p>
      <p><strong>Fecha de fin:</strong> {championship.endDate}</p>
      {/* Aquí puedes añadir secciones adicionales como asignaciones y costos */}
    </div>
  );
};

export default ChampionshipDetailPage;