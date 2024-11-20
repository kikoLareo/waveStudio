// src/routes.js
import React from 'react';
import GenericPage from './pages/GenericPage';
import {users ,roles,  championships,  jobPositions,  organizers,  disciplines} from './schemas/schemas';

const routes = [
  {
    path: '/users',
    element: (
      <GenericPage
        entityName="Usuario"
        fetchUrl="/users"
        createSchema={users}
      />
    ),
  },
  {
    path: '/roles',
    element: (
      <GenericPage
        entityName="Rol"
        fetchUrl="/roles"
        createSchema={roles}
      />
    ),
  },
  {
    path: '/championships',
    element: (
      <GenericPage
        entityName="Campeonato"
        fetchUrl="/championships"
        createSchema={championships}
      />
    ),
  },
  {
    path: '/job-positions',
    element: (
      <GenericPage
        entityName="Puesto de Trabajo"
        fetchUrl="/job-positions"
        createSchema={jobPositions}
      />
    ),
  },
  {
    path: '/organizers',
    element: (
      <GenericPage
        entityName="Organizador"
        fetchUrl="/organizers"
        createSchema={organizers}
      />
    ),
  },
  {
    path: '/disciplines',
    element: (
      <GenericPage
        entityName="Disciplina"
        fetchUrl="/disciplines"
        createSchema={disciplines}
      />
    ),
  },
];

export default routes;