// src/routes.js
import React from 'react';
import GenericPage from './pages/GenericPage';
import {users, userUpdateSchema ,roles,  championships,  jobPositions,  organizers,  disciplines, championshipAssignments} from './schemas/schemas';

const routes = [
  {
    path: '/users',
    element: (
      <GenericPage
        entityName="Usuario"
        fetchUrl="/users"
        componentSchema={users}
        updateSchema={userUpdateSchema}
      />
    ),
  },
  {
    path: '/roles',
    element: (
      <GenericPage
        entityName="Rol"
        fetchUrl="/roles"
        componentSchema={roles}
      />
    ),
  },
  {
    path: '/championships',
    element: (
      <GenericPage
        entityName="Campeonato"
        fetchUrl="/championships"
        componentSchema={championships}
      />
    ),
  },
  {
    path: '/job-positions',
    element: (
      <GenericPage
        entityName="Puesto de Trabajo"
        fetchUrl="/job-positions"
        componentSchema={jobPositions}
      />
    ),
  },
  {
    path: '/organizers',
    element: (
      <GenericPage
        entityName="Organizador"
        fetchUrl="/organizers"
        componentSchema={organizers}
      />
    ),
  },
  {
    path: '/disciplines',
    element: (
      <GenericPage
        entityName="Disciplina"
        fetchUrl="/disciplines"
        componentSchema={disciplines}
      />
    ),
  },
    {
      path: 'assignments',
      element: (
        <GenericPage
          entityName="Asignación de Campeonato"
          fetchUrl="/championship-assignments"
          componentSchema={championshipAssignments}
        />
      ),
    }
];

export default routes;