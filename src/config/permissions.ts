export interface Permission {
  read: string[];
  write: string[];
  delete: string[];
}

export interface Permissions {
  [key: string]: Permission;
}

export const permissions: Permissions = {
  dashboard: {
    read: ['admin', 'editor', 'viewer'],
    write: ['admin'],
    delete: ['admin']
  },
  roles: {
    read: ['admin'],
    write: ['admin'],
    delete: ['admin']
  },
  users: {
    read: ['admin'],
    write: ['admin'],
    delete: ['admin']
  },
  championships: {
    read: ['admin', 'editor', 'viewer'],
    write: ['admin', 'editor'],
    delete: ['admin']
  },
  assignments: {
    read: ['admin', 'editor', 'viewer'],
    write: ['admin', 'editor'],
    delete: ['admin']
  },
  'job-positions': {
    read: ['admin', 'editor'],
    write: ['admin'],
    delete: ['admin']
  }
};

export const checkPermission = (
  resource: string,
  action: keyof Permission,
  userRoles: string[]
): boolean => {
  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;

  const allowedRoles = resourcePermissions[action];
  return userRoles.some(role => allowedRoles.includes(role));
};