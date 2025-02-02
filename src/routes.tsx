import React from 'react';
import Dashboard from './pages/Dashboard';
import Roles from './pages/Roles';
import RoleDetail from './pages/RoleDetail';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Championships from './pages/Championships';
import ChampionshipDetail from './pages/ChampionshipDetail';
import Assignments from './pages/Assignments';
import JobPositions from './pages/JobPositions';
import JobPositionDetail from './pages/JobPositionDetail';

const routes = [
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/roles',
    element: <Roles />
  },
  {
    path: '/roles/:id',
    element: <RoleDetail />
  },
  {
    path: '/users',
    element: <Users />
  },
  {
    path: '/users/:id',
    element: <UserDetail />
  },
  {
    path: '/championships',
    element: <Championships />
  },
  {
    path: '/championships/:id',
    element: <ChampionshipDetail />
  },
  {
    path: '/assignments',
    element: <Assignments />
  },
  {
    path: '/job-positions',
    element: <JobPositions />
  },
  {
    path: '/job-positions/:id',
    element: <JobPositionDetail />
  }
];

export default routes;