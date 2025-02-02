import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface Location {
  lat: number;
  lng: number;
}

interface Place {
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationSelectorProps {
  onLocationSelect: (place: Place) => void;
  placeholder?: string;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  placeholder = 'Buscar ubicación...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ label: string; value: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('No se pudo obtener tu ubicación actual');
          setCurrentLocation(null);
        }
      );
    } else {
      setError('Tu navegador no soporta geolocalización');
      setCurrentLocation(null);
    }
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const locationParams = currentLocation
          ? `&location=${currentLocation.lat},${currentLocation.lng}&radius=50000`
          : '';

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${debouncedQuery}${locationParams}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Error en la búsqueda de lugares');
        }

        const data = await response.json();

        if (data.predictions) {
          setResults(
            data.predictions.map((item: any) => ({
              label: item.description,
              value: item,
            }))
          );
        }
        setError(null);
      } catch (err) {
        setError('Error al buscar lugares');
        console.error('Error fetching places:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [debouncedQuery, currentLocation]);

  const fetchPlaceDetails = async (placeId: string): Promise<Location | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Error obteniendo detalles del lugar');
      }

      const data = await response.json();
      return data.result.geometry.location;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const handleSelectPlace = async (result: { label: string; value: any }) => {
    const location = await fetchPlaceDetails(result.value.place_id);
    
    if (location) {
      onLocationSelect({
        name: result.label,
        latitude: location.lat,
        longitude: location.lng,
      });
      setQuery(result.label);
      setResults([]);
    } else {
      setError('No se pudo obtener la ubicación exacta');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2 pl-10 pr-4 text-sm
            border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {results.map((result, index) => (
              <li
                key={index}
                onClick={() => handleSelectPlace(result)}
                className="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <span className="font-normal truncate">{result.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;