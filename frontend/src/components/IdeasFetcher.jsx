import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useIdeasStore } from '../store/useIdeasStore';

const IdeasFetcher = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchIdeas = useIdeasStore((state) => state.fetchIdeas);
  const ideas = useIdeasStore((state) => state.ideas);
  const isLoading = useIdeasStore((state) => state.isLoading);
  const hasInitialized = useRef(false);
  const lastAuthState = useRef(null);

  // Fetch ideas when user becomes authenticated or when on home page
  useEffect(() => {
    const isHomePage = location.pathname === '/';

    // Fetch ideas if:
    // 1. User is authenticated (for all pages)
    // 2. User is on home page (even if not authenticated)
    if (
      (isAuthenticated || isHomePage) &&
      !isLoading &&
      (!ideas || ideas.length === 0)
    ) {
      fetchIdeas();
      hasInitialized.current = true;
    }
  }, [
    isAuthenticated,
    isLoading,
    fetchIdeas,
    location.pathname,
    ideas?.length,
  ]);

  // This component doesn't render anything
  return null;
};

export default IdeasFetcher;
