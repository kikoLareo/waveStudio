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