import { useState, useEffect } from 'react';
import api from '../services/api';
import logService from '../utils/logService';
import { endpoints } from '../config/api';

interface ChampionshipData {
  id: string;
  name: string;
  location: string;
  organizer: string;
  discipline: string;
  startDate: string;
  endDate: string;
  assignments?: Array<{
    id: string;
    userId: string;
    userName: string;
    position: string;
    hoursWorked: number;
  }>;
}

export const useChampionship = (id?: string) => {
  const [championship, setChampionship] = useState<ChampionshipData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampionship = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await api.get(endpoints.championships.details(id));
        setChampionship(response.data);
        logService.log('info', `Detalles del campeonato ${id} obtenidos exitosamente`);
      } catch (error) {
        const errorMessage = 'Error al obtener los detalles del campeonato';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChampionship();
  }, [id]);

  return { championship, isLoading, error };
};