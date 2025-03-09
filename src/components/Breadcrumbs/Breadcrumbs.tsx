import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, showHome = true }) => {
  const location = useLocation();
  
  // Ensure the last item is marked as active
  const breadcrumbItems = items.map((item, index) => ({
    ...item,
    isActive: index === items.length - 1
  }));
  
  // Add home item if requested
  const allItems = showHome 
    ? [{ label: 'Inicio', path: '/', isActive: false }, ...breadcrumbItems]
    : breadcrumbItems;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {allItems.map((item, index) => (
          <li key={item.path} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
            )}
            
            {item.isActive ? (
              <span className="text-sm font-medium text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {index === 0 && showHome ? (
                  <>
                    <Home className="mr-1 h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
