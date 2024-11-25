import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function LocationSelector({ onLocationSelect, fetchWithApiKey = false }) {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [customResults, setCustomResults] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Obtener la ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          console.log("Ubicación obtenida:", { lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setCurrentLocation(null); // Por si no se puede obtener la ubicación
        }
      );
    } else {
      console.error("Geolocalización no soportada en este navegador.");
      setCurrentLocation(null);
    }
  }, []);

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=AIzaSyD7PT50azZ99KYIsVkGiERjSJziiSaYPa4`
      );
      const data = await response.json();
      const location = data.result.geometry.location;
      return location;
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  };

  const handlePlaceSelect = async (place) => {
    console.log("Place selected:", place);

    setSelectedPlace(place);
    const { place_id } = place.value;

    const location = await fetchPlaceDetails(place_id);

    if (location) {
      const { lat, lng } = location;
      onLocationSelect({
        name: place.label,
        latitude: lat,
        longitude: lng,
      });
    } else {
      console.error("Failed to fetch location details.");
    }
  };

  const handleInputChange = async (query) => {
    if (!query) {
      setCustomResults([]);
      return;
    }

    try {
      const locationParams = currentLocation
        ? `&location=${currentLocation.lat},${currentLocation.lng}&radius=50000` // 50km radius
        : "";

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}${locationParams}&key=AIzaSyD7PT50azZ99KYIsVkGiERjSJziiSaYPa4`
      );
      const data = await response.json();

      if (data.predictions) {
        setCustomResults(
          data.predictions.map((item) => ({
            label: item.description,
            value: item,
          }))
        );
      } else {
        setCustomResults([]);
      }
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  return (
    <div>
      {fetchWithApiKey ? (
        <div>
          <input
            type="text"
            placeholder="Buscar ubicación..."
            onChange={(e) => handleInputChange(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <ul style={{ listStyle: "none", padding: 0 }}>
            {customResults.map((result, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedPlace(result);
                  fetchPlaceDetails(result.value.place_id).then((location) => {
                    if (location) {
                      onLocationSelect({
                        name: result.label,
                        latitude: location.lat,
                        longitude: location.lng,
                      });
                    }
                  });
                }}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                {result.label}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        currentLocation ? (
          <GooglePlacesAutocomplete
            apiKey="AIzaSyD7PT50azZ99KYIsVkGiERjSJziiSaYPa4"
            selectProps={{
              value: selectedPlace,
              onChange: handlePlaceSelect,
              placeholder: "Buscar ubicación...",
            }}
            autocompletionRequest={{
              location: currentLocation
                ? { lat: currentLocation.lat, lng: currentLocation.lng }
                : undefined,
              radius: 50000, // Opcional: 50km
            }}
          /> ) : (
            <GooglePlacesAutocomplete
            apiKey="AIzaSyD7PT50azZ99KYIsVkGiERjSJziiSaYPa4"
            selectProps={{
              value: selectedPlace,
              onChange: handlePlaceSelect,
              placeholder: "Buscar ubicación...",
            }}
          />
        )
      )}
    </div>
  );
}

export default LocationSelector;