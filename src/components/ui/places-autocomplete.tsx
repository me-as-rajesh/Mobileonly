'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

export interface Place {
  city: string;
  state: string;
  lat: number;
  lon: number;
  address: string;
}

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: Place | null) => void;
  defaultValue?: string;
  id: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({ id, onPlaceSelect, defaultValue = '' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Use a state for the input value to allow the user to clear it or type freely
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    // Set the input value if the defaultValue changes (e.g., from form state)
    setInputValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | null = null;
    const currentInputRef = inputRef.current;
    
    if ((window as any).google && currentInputRef) {
      autocomplete = new (window as any).google.maps.places.Autocomplete(currentInputRef, {
        types: ['(cities)'],
        componentRestrictions: { country: 'in' },
        fields: ['address_components', 'geometry.location', 'formatted_address']
      });

      const placeChangedListener = autocomplete.addListener('place_changed', () => {
        const gPlace = autocomplete!.getPlace();

        if (gPlace.geometry && gPlace.address_components) {
          const getAddressComponent = (type: string) => {
            return gPlace.address_components?.find((c: any) => c.types.includes(type))?.long_name || '';
          };
          
          const city = getAddressComponent('locality') || getAddressComponent('administrative_area_level_2') || '';
          const state = getAddressComponent('administrative_area_level_1') || '';
          const formatted_address = gPlace.formatted_address || '';

          const selectedPlace: Place = {
            city: city,
            state: state,
            lat: gPlace.geometry.location!.lat(),
            lon: gPlace.geometry.location!.lng(),
            address: formatted_address,
          };
          setInputValue(formatted_address);
          onPlaceSelect(selectedPlace);
        } else {
          onPlaceSelect(null);
        }
      });

      // Cleanup function to remove the listener
      return () => {
        if ((window as any).google) {
          (window as any).google.maps.event.removeListener(placeChangedListener);
          // More robust cleanup
          const pacContainers = document.querySelectorAll('.pac-container');
          pacContainers.forEach(container => container.remove());
        }
      };
    }
  }, [onPlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      // If user clears the input, reset the selected place
      if (e.target.value === '') {
          onPlaceSelect(null);
      }
  }

  return (
      <Input
        id={id}
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Start typing your city..."
        type="text"
      />
  );
};

export default PlacesAutocomplete;
