export const users = [
  { name: 'username', label: 'Nombre de Usuario', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Contraseña', type: 'password', required: false },
];

export const roles = [
  { name: 'name', label: 'Nombre del Rol', type: 'text', required: true },
  { name: 'description', label: 'Descripción', type: 'text', required: false },
];

export const championships = [
  { name: 'name', label: 'Nombre del Campeonato', type: 'text', required: true },
  { name: 'location', label: 'Ubicación', type: 'text', required: true },
  { name: 'organizer', label: 'Organizador', type: 'bdComponent', required: true, bdComponent: 'organizers' },
  { name: 'discipline', label: 'Disciplina', type: 'bdComponent', required: true, bdComponent: 'disciplines' },
  { name: 'startDate', label: 'Fecha de Inicio', type: 'date', required: true },
  { name: 'endDate', label: 'Fecha de Fin', type: 'date', required: true },
];

export const jobPositions = [
  { name: 'title', label: 'Título del Puesto', type: 'text', required: true },
  { name: 'description', label: 'Descripción', type: 'text', required: false },
];

export const championshipAssignments = [
  { name: 'user_id', label: 'Usuario', type: 'bdComponent', required: true, bdComponent: 'users' },
  { name: 'championship_id', label: 'Campeonato', type: 'bdComponent', required: true, bdComponent: 'championships' },
  { name: 'job_position_id', label: 'Puesto de Trabajo', type: 'bdComponent', required: true, bdComponent: 'job_positions' },
  { name: 'hours_worked', label: 'Horas Trabajadas', type: 'number', required: true },
];

export const organizers = [
  { name: 'name', label: 'Nombre del Organizador', type: 'text', required: true },
];

export const disciplines = [
  { name: 'name', label: 'Nombre de la Disciplina', type: 'text', required: true },
  { name: 'category', label: 'Categoría', type: 'text', required: false },
];