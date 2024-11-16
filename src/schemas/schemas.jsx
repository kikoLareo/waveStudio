export const userUpdateSchema = [
    { name: 'username', label: 'Nombre de Usuario', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ];

export const userCreateSchema = [
    { name: 'username', label: 'Nombre de Usuario', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
  ];
  
 export const roleSchema = [
    { name: 'name', label: 'Nombre del Rol', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'text' },
  ];


// Esquema para crear un Campeonato
export const championshipCreateSchema = [
  { name: 'name', label: 'Nombre del Campeonato', type: 'text', required: true },
  { name: 'location', label: 'Ubicación', type: 'text', required: true },
  { name: 'date', label: 'Fecha', type: 'date', required: true },
];

// Esquema para actualizar un Campeonato
export const championshipUpdateSchema = [
  { name: 'name', label: 'Nombre del Campeonato', type: 'text', required: true },
  { name: 'location', label: 'Ubicación', type: 'text', required: true },
  { name: 'date', label: 'Fecha', type: 'date', required: true },
];

// Esquema para crear un Puesto de Trabajo
export const jobPositionCreateSchema = [
  { name: 'title', label: 'Título del Puesto', type: 'text', required: true },
  { name: 'description', label: 'Descripción', type: 'text' },
];

// Esquema para actualizar un Puesto de Trabajo
export const jobPositionUpdateSchema = [
  { name: 'title', label: 'Título del Puesto', type: 'text', required: true },
  { name: 'description', label: 'Descripción', type: 'text' },
];

// Esquema para la asignación de usuarios a campeonatos
export const championshipAssignmentCreateSchema = [
  { name: 'user_id', label: 'ID del Usuario', type: 'number', required: true },
  { name: 'championship_id', label: 'ID del Campeonato', type: 'number', required: true },
  { name: 'job_position_id', label: 'ID del Puesto de Trabajo', type: 'number', required: true },
  { name: 'hours_worked', label: 'Horas Trabajadas', type: 'number', required: true },
];

// Esquema para actualizar una asignación (puede ser igual al de creación)
export const championshipAssignmentUpdateSchema = [
  { name: 'user_id', label: 'ID del Usuario', type: 'number', required: true },
  { name: 'championship_id', label: 'ID del Campeonato', type: 'number', required: true },
  { name: 'job_position_id', label: 'ID del Puesto de Trabajo', type: 'number', required: true },
  { name: 'hours_worked', label: 'Horas Trabajadas', type: 'number', required: true },
];