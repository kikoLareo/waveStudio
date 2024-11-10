export const userSchema = [
    { name: 'name', label: 'Nombre de Usuario', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
  ];
  
 export const roleSchema = [
    { name: 'name', label: 'Nombre del Rol', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'text' },
  ];