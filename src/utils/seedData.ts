import api from '../services/api';
import logService from './logService';

/**
 * Función para generar datos de ejemplo en la base de datos
 */
export const seedData = async () => {
  try {
    logService.log('info', 'Iniciando generación de datos de ejemplo');
    
    // Crear roles
    const roles = [
      { name: 'Administrador', description: 'Acceso completo al sistema' },
      { name: 'Juez', description: 'Puede evaluar en campeonatos' },
      { name: 'Organizador', description: 'Puede gestionar campeonatos' },
      { name: 'Asistente', description: 'Ayuda en la organización' }
    ];
    
    const createdRoles = await Promise.all(
      roles.map(role => api.post('/roles', role))
    );
    logService.log('info', 'Roles creados exitosamente', { count: createdRoles.length });
    
    // Crear usuarios
    const users = [
      { username: 'admin', email: 'admin@wavestudio.com', password: 'admin123', role_id: 1 },
      { username: 'juez1', email: 'juez1@wavestudio.com', password: 'juez123', role_id: 2 },
      { username: 'juez2', email: 'juez2@wavestudio.com', password: 'juez123', role_id: 2 },
      { username: 'organizador1', email: 'org1@wavestudio.com', password: 'org123', role_id: 3 },
      { username: 'asistente1', email: 'asistente1@wavestudio.com', password: 'asistente123', role_id: 4 }
    ];
    
    const createdUsers = await Promise.all(
      users.map(user => api.post('/users', user))
    );
    logService.log('info', 'Usuarios creados exitosamente', { count: createdUsers.length });
    
    // Crear organizadores
    const organizers = [
      { 
        name: 'Federación Española de Surf', 
        description: 'Organización oficial de surf en España',
        placement: 'Madrid, España',
        phone: '+34 912 345 678',
        email: 'contacto@fesurfing.es',
        website: 'https://www.fesurfing.es'
      },
      { 
        name: 'World Surf League', 
        description: 'Organización internacional de competiciones de surf',
        placement: 'California, USA',
        phone: '+1 310 450 1212',
        email: 'info@worldsurfleague.com',
        website: 'https://www.worldsurfleague.com'
      },
      { 
        name: 'Asociación de Surf Canaria', 
        description: 'Organización de surf en las Islas Canarias',
        placement: 'Las Palmas, España',
        phone: '+34 928 123 456',
        email: 'info@surfcanarias.org',
        website: 'https://www.surfcanarias.org'
      }
    ];
    
    const createdOrganizers = await Promise.all(
      organizers.map(organizer => api.post('/organizers', organizer))
    );
    logService.log('info', 'Organizadores creados exitosamente', { count: createdOrganizers.length });
    
    // Crear disciplinas
    const disciplines = [
      { name: 'Shortboard', category: 'Surf' },
      { name: 'Longboard', category: 'Surf' },
      { name: 'Bodyboard', category: 'Surf' },
      { name: 'SUP', category: 'Paddle' },
      { name: 'Kitesurf', category: 'Vela' }
    ];
    
    const createdDisciplines = await Promise.all(
      disciplines.map(discipline => api.post('/disciplines', discipline))
    );
    logService.log('info', 'Disciplinas creadas exitosamente', { count: createdDisciplines.length });
    
    // Crear puestos de trabajo
    const jobPositions = [
      { title: 'Juez Principal', description: 'Responsable de coordinar al equipo de jueces' },
      { title: 'Juez de Playa', description: 'Evalúa las olas desde la playa' },
      { title: 'Juez de Torre', description: 'Evalúa las olas desde la torre de jueces' },
      { title: 'Cronometrador', description: 'Controla los tiempos de las mangas' },
      { title: 'Locutor', description: 'Narra la competición' },
      { title: 'Asistente de Playa', description: 'Ayuda en la organización en la playa' }
    ];
    
    const createdJobPositions = await Promise.all(
      jobPositions.map(position => api.post('/job-positions', position))
    );
    logService.log('info', 'Puestos de trabajo creados exitosamente', { count: createdJobPositions.length });
    
    // Crear campeonatos
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 2);
    
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(today.getMonth() + 3);
    
    const championships = [
      {
        name: 'Campeonato Nacional de Surf 2025',
        location: 'Playa de Las Américas, Tenerife',
        organizer_id: 1,
        discipline_id: 1,
        start_date: nextMonth.toISOString().split('T')[0],
        end_date: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Campeonato nacional de surf con las mejores olas de Canarias'
      },
      {
        name: 'Copa Longboard 2025',
        location: 'Playa de Somo, Cantabria',
        organizer_id: 1,
        discipline_id: 2,
        start_date: twoMonthsLater.toISOString().split('T')[0],
        end_date: new Date(twoMonthsLater.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Competición de longboard en la costa cantábrica'
      },
      {
        name: 'WSL European Tour 2025',
        location: 'Playa de Mundaka, País Vasco',
        organizer_id: 2,
        discipline_id: 1,
        start_date: threeMonthsLater.toISOString().split('T')[0],
        end_date: new Date(threeMonthsLater.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Etapa europea del circuito mundial de surf'
      }
    ];
    
    const createdChampionships = await Promise.all(
      championships.map(championship => api.post('/championships', championship))
    );
    logService.log('info', 'Campeonatos creados exitosamente', { count: createdChampionships.length });
    
    // Crear asignaciones
    const assignments = [
      {
        user_id: 2, // juez1
        championship_id: 1,
        job_position_id: 1, // Juez Principal
        hours_worked: 24,
        start_date: nextMonth.toISOString().split('T')[0],
        end_date: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        user_id: 3, // juez2
        championship_id: 1,
        job_position_id: 2, // Juez de Playa
        hours_worked: 20,
        start_date: nextMonth.toISOString().split('T')[0],
        end_date: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        user_id: 5, // asistente1
        championship_id: 1,
        job_position_id: 6, // Asistente de Playa
        hours_worked: 30,
        start_date: nextMonth.toISOString().split('T')[0],
        end_date: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        user_id: 2, // juez1
        championship_id: 2,
        job_position_id: 1, // Juez Principal
        hours_worked: 16,
        start_date: twoMonthsLater.toISOString().split('T')[0],
        end_date: new Date(twoMonthsLater.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        user_id: 4, // organizador1
        championship_id: 3,
        job_position_id: 5, // Locutor
        hours_worked: 40,
        start_date: threeMonthsLater.toISOString().split('T')[0],
        end_date: new Date(threeMonthsLater.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];
    
    const createdAssignments = await Promise.all(
      assignments.map(assignment => api.post('/assignments', assignment))
    );
    logService.log('info', 'Asignaciones creadas exitosamente', { count: createdAssignments.length });
    
    return {
      success: true,
      message: 'Datos de ejemplo generados exitosamente',
      data: {
        roles: createdRoles.length,
        users: createdUsers.length,
        organizers: createdOrganizers.length,
        disciplines: createdDisciplines.length,
        jobPositions: createdJobPositions.length,
        championships: createdChampionships.length,
        assignments: createdAssignments.length
      }
    };
  } catch (error) {
    logService.log('error', 'Error al generar datos de ejemplo', { error });
    return {
      success: false,
      message: 'Error al generar datos de ejemplo',
      error
    };
  }
};

export default seedData;
