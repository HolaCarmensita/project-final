import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useIdeasStore } from '../store/useIdeasStore';

const IdeasFetcher = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchIdeas = useIdeasStore((state) => state.fetchIdeas);
  const ideas = useIdeasStore((state) => state.ideas);
  const isLoading = useIdeasStore((state) => state.isLoading);
  const hasInitialized = useRef(false);
  const lastAuthState = useRef(null);

  // Fetch ideas when user becomes authenticated
  useEffect(() => {
    // Only log when auth state actually changes
    if (lastAuthState.current !== isAuthenticated) {
      console.log('IdeasFetcher: isAuthenticated changed to:', isAuthenticated);
      lastAuthState.current = isAuthenticated;
    }

    // Fetch ideas when user becomes authenticated
    if (isAuthenticated && !isLoading) {
      console.log('IdeasFetcher: User authenticated, fetching ideas...');
      fetchIdeas();
      hasInitialized.current = true;
    }
  }, [isAuthenticated, isLoading, fetchIdeas]);

  // This component doesn't render anything
  return null;
};

export default IdeasFetcher;
