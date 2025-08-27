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

  // Fetch ideas only when user is authenticated
  useEffect(() => {
    // Only log when auth state actually changes
    if (lastAuthState.current !== isAuthenticated) {
      console.log('IdeasFetcher: isAuthenticated changed to:', isAuthenticated);
      lastAuthState.current = isAuthenticated;
    }

    // Only fetch if user is authenticated, we haven't initialized yet, ideas are empty, and not currently loading
    if (
      isAuthenticated &&
      !hasInitialized.current &&
      ideas.length === 0 &&
      !isLoading
    ) {
      console.log('IdeasFetcher: Fetching ideas...');
      fetchIdeas();
      hasInitialized.current = true;
    }
  }, [isAuthenticated, ideas.length, isLoading, fetchIdeas]);

  // This component doesn't render anything
  return null;
};

export default IdeasFetcher;
