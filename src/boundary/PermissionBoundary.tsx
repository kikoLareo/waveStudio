import React, { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { checkPermission } from '../config/permissions';

interface Props {
  children: ReactNode;
  resource: string;
  action: 'read' | 'write' | 'delete';
  userRoles: string[];
  fallback?: ReactNode;
}

const DefaultFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-lg p-6">
    <Lock className="w-12 h-12 text-gray-400 mb-4" />
    <p className="text-gray-600 text-center">
      No tienes permisos para acceder a este recurso
    </p>
  </div>
);

const PermissionBoundary: React.FC<Props> = ({
  children,
  resource,
  action,
  userRoles,
  fallback = <DefaultFallback />
}) => {
  const hasPermission = checkPermission(resource, action, userRoles);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionBoundary;