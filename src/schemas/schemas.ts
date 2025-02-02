interface SchemaField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'date' | 'number' | 'bdComponent';
  required: boolean;
  bdComponent?: string;
}

export const users: SchemaField[] = [
  { name: 'username', label: 'Nombre de Usuario', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Contraseña', type: 'password', required: false },
];

export const userUpdateSchema: SchemaField[] = [
  { name: 'username', label: 'Nombre de Usuario', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'currentPassword', label: 'Contraseña Actual', type: 'password', required: true },
  { name: 'newPassword', label: 'Nueva Contraseña', type: 'password', required: true },
  { name: 'confirmPassword', label: 'Confirmar Contraseña', type: 'password', required: true },
];

export const roles: SchemaField[] = [
  { name: 'name', label: 'Nombre del Rol', type: 'text', required: true },
  { name: 'description', label: 'Descripción', type: 'text', required: false },
];

export const championships: SchemaField[] = [
  { name: 'name', label: 'Nombre del Campeonato', type: 'text', required: true },
  { name: 'location', label: 'Ubicación', type: 'text', required: true },
  { name: 'organizer', label: 'Organizador', type: 'bdComponent', required: true, bdComponent: 'organizers' },
  { name: 'discipline', label: 'Disciplina', type: 'bdComponent', required: true, bdComponent: 'disciplines' },
  { name: 'startDate', label: 'Fecha de Inicio', type: 'date', required: true },
  { name: 'endDate', label: 'Fecha de Fin', type: 'date', required: true },
];

export const jobPositions: SchemaField[] = [
  { name: 'title', label: 'Título del Puesto', type: 'text', required: true },
  { name: 'description', label: 'Descripción', type: 'text', required: false },
];

export const championshipAssignments: SchemaField[] = [
  { name: 'user_id', label: 'Usuario', type: 'bdComponent', required: true, bdComponent: 'users' },
  { name: 'championship_id', label: 'Campeonato', type: 'bdComponent', required: true, bdComponent: 'championships' },
  { name: 'job_position_id', label: 'Puesto de Trabajo', type: 'bdComponent', required: true, bdComponent: 'job_positions' },
  { name: 'hours_worked', label: 'Horas Trabajadas', type: 'number', required: true },
];

export const organizers: SchemaField[] = [
  { name: 'name', label: 'Nombre del Organizador', type: 'text', required: true },
];

export const disciplines: SchemaField[] = [
  { name: 'name', label: 'Nombre de la Disciplina', type: 'text', required: true },
  { name: 'category', label: 'Categoría', type: 'text', required: false },
];

type SchemaName = 'users' | 'userUpdate' | 'roles' | 'championships' | 'jobPositions' | 'championshipAssignments' | 'organizers' | 'disciplines';

export const returnSchema = (schemaName: SchemaName): SchemaField[] => {
  const schemas: Record<SchemaName, SchemaField[]> = {
    users,
    userUpdate: userUpdateSchema,
    roles,
    championships,
    jobPositions,
    championshipAssignments,
    organizers,
    disciplines,
  };

  return schemas[schemaName] || [];
};