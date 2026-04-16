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
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const currentInputRef = inputRef.current;
    if (!currentInputRef) return;

    let autocomplete: google.maps.places.Autocomplete | null = null;
    let placeChangedListener: google.maps.MapsEventListener | null = null;

    const init = () => {
      if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) {
        return;
      }
      
      autocomplete = new (window as any).google.maps.places.Autocomplete(currentInputRef, {
        types: ['(cities)'],
        componentRestrictions: { country: 'in' },
        fields: ['address_components', 'geometry.location', 'formatted_address']
      });

      placeChangedListener = autocomplete.addListener('place_changed', () => {
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
    }

    const intervalId = setInterval(() => {
      if ((window as any).google && (window as any).google.maps) {
        init();
        clearInterval(intervalId);
      }
    }, 200);

    return () => {
      clearInterval(intervalId);
      if ((window as any).google && placeChangedListener) {
        (window as any).google.maps.event.removeListener(placeChangedListener);
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => container.remove());
      }
    };
  }, [onPlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
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
