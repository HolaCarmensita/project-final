import { useEffect } from 'react';
import useUserStore from '../store/useUserStore';

export default function useUserProfileLoader(isAuthenticated) {
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
}


