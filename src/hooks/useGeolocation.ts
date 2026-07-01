import { useCallback, useEffect, useState } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error' | 'unsupported';

interface GeolocationState {
  status: GeolocationStatus;
  coords: Coordinates | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: 'idle',
    coords: null,
    error: null
  });

  const refresh = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unsupported', coords: null, error: 'المتصفح لا يدعم تحديد الموقع' });
      return;
    }
    setState((current) => ({ ...current, status: 'loading', error: null }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'success',
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
          error: null
        });
      },
      (error) => {
        setState({ status: 'error', coords: null, error: error.message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
