import React, { Suspense, ReactNode } from 'react';
import { Loader } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface Props {
  children: ReactNode;
  errorFallback?: ReactNode;
  loadingFallback?: ReactNode;
}

const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader className="w-8 h-8 text-blue-500 animate-spin" />
  </div>
);

const AsyncBoundary: React.FC<Props> = ({
  children,
  errorFallback,
  loadingFallback = <DefaultLoadingFallback />
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;