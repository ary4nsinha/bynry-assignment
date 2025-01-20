import React,{ useEffect, useState } from "react";
import PropTypes from "prop-types";

const LocationInput = ({ value, onChange }) => {
  const inputRef = React.createRef();
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.formatted_address) {
        setInputValue(place.formatted_address);
        onChange({
          location: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        });
      }
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onChange]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for location..."
        value={inputValue}
        onChange={handleInputChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p className="text-sm text-gray-500 mt-1">
        Please select a location from the dropdown suggestions
      </p>
    </div>
  );
};

LocationInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LocationInput;
