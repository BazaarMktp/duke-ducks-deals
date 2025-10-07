import { useState } from 'react';
import { toast } from 'sonner';

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

export const useLocationService = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);

  const requestLocation = async (): Promise<LocationData | null> => {
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        return null;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get location name
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      
      const locationData: LocationData = {
        latitude,
        longitude,
        name: data.display_name || 'Unknown location'
      };

      setLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Location error:', error);
      toast.error('Failed to get your location. Please enter it manually.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getLocationSuggestions = (query: string): string[] => {
    // Common Duke campus locations
    const campusLocations = [
      'West Campus',
      'East Campus',
      'Central Campus',
      'Bryan Center',
      'Perkins Library',
      'Cameron Indoor Stadium',
      'Sarah P. Duke Gardens',
      'Duke Chapel',
      'Fitzpatrick Center',
      'Sanford School of Public Policy',
      'Duke University Hospital',
      'Ninth Street',
      'Trinity College of Arts & Sciences'
    ];

    if (!query) return campusLocations.slice(0, 5);
    
    return campusLocations.filter(loc => 
      loc.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  return {
    loading,
    location,
    requestLocation,
    getLocationSuggestions
  };
};
