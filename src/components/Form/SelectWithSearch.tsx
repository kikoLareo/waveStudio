import React, { useEffect, useState, ReactNode } from 'react';
import { Search } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectWithSearchProps {
  options: SelectOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder: string;
  label?: string;
  error?: string;
  isLoading?: boolean;
  icon?: ReactNode;
}

const SelectWithSearch: React.FC<SelectWithSearchProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  error,
  isLoading = false,
  icon
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  useEffect(() => {
    if (value !== null) {
      const option = options.find(opt => opt.value === value);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`
            flex items-center justify-between p-2 border rounded-md cursor-pointer
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${isOpen ? 'ring-2 ring-blue-500' : ''}
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          {icon && <span className="mr-2">{icon}</span>}
          <span className="flex-grow text-left">
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <span className="text-gray-400">▼</span>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                  onClick={(e) => e.stopPropagation()}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-2 text-center text-gray-500">Cargando...</div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-2 text-center text-gray-500">No hay resultados</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={typeof option.value === 'string' ? option.value : `option-${option.value}`}
                    className={`
                      p-2 cursor-pointer hover:bg-gray-100
                      ${selectedOption?.value === option.value ? 'bg-blue-50 text-blue-700' : ''}
                    `}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectWithSearch;
