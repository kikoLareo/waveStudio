// src/components/Form/SelectWithSearch.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Usa tu servicio de API para obtener los datos

function SelectWithSearch({ name, value, onChange, placeholder, bdComponent }) {
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Llamada a la API para obtener los elementos de la base de datos
    const fetchOptions = async () => {
      try {
        const response = await api.get(`/${bdComponent}`);
        setOptions(response.data);
      } catch (error) {
        console.error(`Error al obtener opciones de ${bdComponent}:`, error);
      }
    };
    fetchOptions();
  }, [bdComponent]);

  // Filtrar las opciones basadas en el término de búsqueda
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="select-with-search">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Seleccione una opción</option>
        {filteredOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectWithSearch;