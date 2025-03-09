import React from 'react';
import Dashboard from './pages/Dashboard';
import Roles from './pages/Roles';
import RoleDetail from './pages/RoleDetail';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import UserManagement from './pages/UserManagement';
import UserSettings from './pages/UserSettings';
import Login from './pages/Login';
import Championships from './pages/Championships';
import ChampionshipDetail from './pages/ChampionshipDetail';
import Assignments from './pages/Assignments';
import JobPositions from './pages/JobPositions';
import JobPositionDetail from './pages/JobPositionDetail';
import OrganizerPage from './pages/Organizers';
import OrganizerDetail from './pages/OrganizerDetail';
import DisciplinePage from './pages/Disciplines';
import DisciplineDetail from './pages/DisciplineDetail';
import SeedDataPage from './pages/SeedData';
import ProtectedRoute from './components/ProtectedRoute';

// Definir IDs de roles (estos deberían coincidir con los IDs en la base de datos)
const ROLE_IDS = {
  MASTER: 1, // Asumiendo que el rol Master tiene ID 1
  USER: 2    // Asumiendo que el rol Usuario normal tiene ID 2
};

const routes = [
  // Ruta pública para login
  {
    path: '/login',
    element: <Login />
  },
  // Rutas protegidas que requieren autenticación
  {
    path: '/',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/roles',
    element: <ProtectedRoute><Roles /></ProtectedRoute>
  },
  {
    path: '/roles/:id',
    element: <ProtectedRoute><RoleDetail /></ProtectedRoute>
  },
  {
    path: '/users',
    element: <ProtectedRoute><Users /></ProtectedRoute>
  },
  {
    path: '/users/:id',
    element: <ProtectedRoute><UserDetail /></ProtectedRoute>
  },
  // Ruta para gestión de usuarios (solo para usuarios Master)
  {
    path: '/user-management',
    element: <ProtectedRoute requiredRoles={[ROLE_IDS.MASTER]}><UserManagement /></ProtectedRoute>
  },
  {
    path: '/championships',
    element: <ProtectedRoute><Championships /></ProtectedRoute>
  },
  {
    path: '/championships/:id',
    element: <ProtectedRoute><ChampionshipDetail /></ProtectedRoute>
  },
  {
    path: '/assignments',
    element: <ProtectedRoute><Assignments /></ProtectedRoute>
  },
  {
    path: '/job-positions',
    element: <ProtectedRoute><JobPositions /></ProtectedRoute>
  },
  {
    path: '/job-positions/:id',
    element: <ProtectedRoute><JobPositionDetail /></ProtectedRoute>
  },
  {
    path: '/organizers',
    element: <ProtectedRoute><OrganizerPage /></ProtectedRoute>
  },
  {
    path: '/organizers/:id',
    element: <ProtectedRoute><OrganizerDetail /></ProtectedRoute>
  },
  {
    path: '/disciplines', 
    element: <ProtectedRoute><DisciplinePage /></ProtectedRoute>
  },
  {
    path: '/disciplines/:id', 
    element: <ProtectedRoute><DisciplineDetail /></ProtectedRoute>
  },
  {
    path: '/seed-data', 
    element: <ProtectedRoute requiredRoles={[ROLE_IDS.MASTER]}><SeedDataPage /></ProtectedRoute>
  },
  {
    path: '/settings',
    element: <ProtectedRoute><UserSettings /></ProtectedRoute>
  }
];

export default routes;
