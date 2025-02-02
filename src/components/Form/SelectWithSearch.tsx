import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Loader, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../services/api';
import logService from '../../utils/logService';
import { getComponentById } from '../../services/componentService';

interface Option {
  id: string | number;
  name: string;
  [key: string]: any;
}

interface SelectWithSearchProps {
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  bdComponent: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const SelectWithSearch: React.FC<SelectWithSearchProps> = ({
  name,
  value,
  onChange,
  placeholder = 'Buscar...',
  bdComponent,
  error,
  label,
  required = false,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/${bdComponent}${debouncedSearchTerm ? `?search=${debouncedSearchTerm}` : ''}`);
        setOptions(response.data);
        setHighlightedIndex(-1);
        logService.log('info', `Opciones obtenidas para ${bdComponent}`);
      } catch (error) {
        logService.log('error', `Error al obtener opciones de ${bdComponent}`, { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [bdComponent, debouncedSearchTerm]);

  useEffect(() => {
    const fetchSelectedOption = async () => {
      if (value && !selectedOption) {
        try {
          const response = await getComponentById(bdComponent, value.toString());
          setSelectedOption(response.data);
        } catch (error) {
          logService.log('error', `Error al obtener opción seleccionada`, { error });
        }
      }
    };

    fetchSelectedOption();
  }, [value, bdComponent, selectedOption]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option.id);
    setSelectedOption(option);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange('');
    setSelectedOption(null);
    setSearchTerm('');
  };

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`
          relative rounded-md shadow-sm
          ${error ? 'ring-1 ring-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div
          className={`
            min-h-[2.5rem] relative flex items-center
            border rounded-md
            ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}
            ${error ? 'border-red-300' : ''}
            ${disabled ? 'bg-gray-50' : 'bg-white'}
          `}
          onClick={() => !disabled && setIsOpen(true)}
        >
          {isOpen ? (
            <input
              ref={searchInputRef}
              type="text"
              className="
                w-full pl-10 pr-8 py-2 text-sm
                border-none focus:ring-0 focus:outline-none
              "
              placeholder={placeholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          ) : (
            <div className="flex-1 pl-10 pr-8 py-2 text-sm truncate">
              {selectedOption ? selectedOption.name : placeholder}
            </div>
          )}

          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader className="h-4 w-4 text-gray-400 animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-gray-400" />
            )}
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <ChevronDown 
              className={`
                h-4 w-4 text-gray-400 ml-1
                transition-transform duration-200
                ${isOpen ? 'transform rotate-180' : ''}
              `}
            />
          </div>
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div className="
            absolute z-10 mt-1 w-full
            bg-white rounded-md shadow-lg
            max-h-60 overflow-auto
            border border-gray-200
          ">
            <ul
              role="listbox"
              className="py-1"
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={option.id}
                  role="option"
                  aria-selected={value === option.id}
                  className={`
                    px-3 py-2 text-sm cursor-pointer
                    flex items-center
                    ${highlightedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    ${value === option.id ? 'text-blue-600 font-medium' : 'text-gray-900'}
                  `}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {isOpen && !isLoading && filteredOptions.length === 0 && (
          <div className="
            absolute z-10 mt-1 w-full
            bg-white rounded-md shadow-lg
            border border-gray-200
            p-4 text-center text-sm text-gray-500
          ">
            No se encontraron resultados
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectWithSearch;