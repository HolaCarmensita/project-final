import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useIdeasStore } from '../store/useIdeasStore';

const IdeasFetcher = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchIdeas = useIdeasStore((state) => state.fetchIdeas);

  // Fetch ideas when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchIdeas();
    }
  }, [isAuthenticated, fetchIdeas]);

  // This component doesn't render anything
  return null;
};

export default IdeasFetcher;
