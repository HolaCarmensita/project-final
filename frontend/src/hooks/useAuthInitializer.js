import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

export default function useAuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}


