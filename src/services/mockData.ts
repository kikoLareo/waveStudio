import { v4 as uuidv4 } from 'uuid';

interface MockData {
  [key: string]: any[];
}

const mockData: MockData = {
  roles: [
    { 
      id: '1', 
      name: 'Administrador', 
      description: 'Control total del sistema',
      permissions: ['read', 'write', 'delete']
    },
    { 
      id: '2', 
      name: 'Editor', 
      description: 'Gestión de contenido y asignaciones',
      permissions: ['read', 'write']
    },
    { 
      id: '3', 
      name: 'Visualizador', 
      description: 'Solo lectura de información',
      permissions: ['read']
    }
  ],
  users: [
    { 
      id: '1', 
      username: 'admin', 
      email: 'admin@wavestudio.com',
      role: 'Administrador',
      role_id: '1',
      active: true
    },
    { 
      id: '2', 
      username: 'editor', 
      email: 'editor@wavestudio.com',
      role: 'Editor',
      role_id: '2',
      active: true
    },
    { 
      id: '3', 
      username: 'viewer', 
      email: 'viewer@wavestudio.com',
      role: 'Visualizador',
      role_id: '3',
      active: true
    }
  ],
  championships: [
    {
      id: '1',
      name: 'Campeonato Nacional de Natación 2024',
      location: 'Centro Acuático Olímpico',
      organizer: 'Federación Nacional de Natación',
      organizer_id: '1',
      discipline: 'Natación',
      discipline_id: '1',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
      status: 'Programado',
      maxParticipants: 200
    },
    {
      id: '2',
      name: 'Torneo Regional de Atletismo',
      location: 'Estadio Municipal',
      organizer: 'Liga Regional de Atletismo',
      organizer_id: '2',
      discipline: 'Atletismo',
      discipline_id: '2',
      startDate: '2024-07-15',
      endDate: '2024-07-20',
      status: 'Planificación',
      maxParticipants: 150
    }
  ],
  'job-positions': [
    {
      id: '1',
      title: 'Árbitro Principal',
      description: 'Responsable de supervisar y dirigir las competencias',
      hourlyRate: 50,
      minHours: 4,
      maxHours: 8,
      requirements: 'Certificación nacional de arbitraje'
    },
    {
      id: '2',
      title: 'Asistente Técnico',
      description: 'Apoyo en la organización y logística del evento',
      hourlyRate: 30,
      minHours: 6,
      maxHours: 10,
      requirements: 'Experiencia en eventos deportivos'
    }
  ],
  assignments: [
    {
      id: '1',
      user_id: '1',
      championship_id: '1',
      job_position_id: '1',
      hours_worked: 8,
      status: 'Activo',
      start_date: '2024-06-01',
      end_date: '2024-06-15',
      userName: 'admin',
      championshipName: 'Campeonato Nacional de Natación 2024',
      positionTitle: 'Árbitro Principal'
    },
    {
      id: '2',
      user_id: '2',
      championship_id: '1',
      job_position_id: '2',
      hours_worked: 6,
      status: 'Activo',
      start_date: '2024-06-01',
      end_date: '2024-06-15',
      userName: 'editor',
      championshipName: 'Campeonato Nacional de Natación 2024',
      positionTitle: 'Asistente Técnico'
    }
  ]
};

// Helper function to get related data
const getRelatedData = (type: string, item: any) => {
  switch (type) {
    case 'assignments':
      const user = mockData.users.find(u => u.id === item.user_id);
      const championship = mockData.championships.find(c => c.id === item.championship_id);
      const position = mockData['job-positions'].find(p => p.id === item.job_position_id);
      return {
        ...item,
        userName: user?.username || 'Usuario no encontrado',
        championshipName: championship?.name || 'Campeonato no encontrado',
        positionTitle: position?.title || 'Puesto no encontrado'
      };
    default:
      return item;
  }
};

export const generateMockData = (type: keyof typeof mockData) => {
  const handleError = (message: string) => {
    console.error(`Mock API Error: ${message}`);
    return Promise.reject(new Error(message));
  };

  return {
    get: () => {
      try {
        const items = mockData[type]?.map(item => getRelatedData(type, item)) || [];
        return Promise.resolve({ data: items });
      } catch (error) {
        return handleError(`Error fetching ${type}`);
      }
    },

    getById: (id: string) => {
      try {
        const item = mockData[type]?.find(item => item.id === id);
        if (!item) {
          return handleError(`${type} not found with id: ${id}`);
        }
        return Promise.resolve({ data: getRelatedData(type, item) });
      } catch (error) {
        return handleError(`Error fetching ${type} by id: ${id}`);
      }
    },

    create: (data: any) => {
      try {
        const newItem = {
          ...data,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };
        mockData[type]?.push(newItem);
        return Promise.resolve({ data: getRelatedData(type, newItem) });
      } catch (error) {
        return handleError(`Error creating ${type}`);
      }
    },

    update: (id: string, data: any) => {
      try {
        const index = mockData[type]?.findIndex(item => item.id === id);
        if (index === -1 || index === undefined) {
          return handleError(`${type} not found with id: ${id}`);
        }
        mockData[type][index] = {
          ...mockData[type][index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        return Promise.resolve({ data: getRelatedData(type, mockData[type][index]) });
      } catch (error) {
        return handleError(`Error updating ${type}`);
      }
    },

    delete: (id: string) => {
      try {
        const index = mockData[type]?.findIndex(item => item.id === id);
        if (index === -1 || index === undefined) {
          return handleError(`${type} not found with id: ${id}`);
        }
        mockData[type]?.splice(index, 1);
        return Promise.resolve({ data: { success: true } });
      } catch (error) {
        return handleError(`Error deleting ${type}`);
      }
    }
  };
};