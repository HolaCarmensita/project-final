import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useIdeasStore } from '../store/useIdeasStore';

const IdeasFetcher = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const fetchIdeas = useIdeasStore((state) => state.fetchIdeas);
  const ideas = useIdeasStore((state) => state.ideas);

  // Initialize auth state on component mount
  useEffect(() => {
    console.log('IdeasFetcher: Initializing auth state...');
    initializeAuth();
  }, [initializeAuth]);

  // Fetch ideas when user is authenticated
  useEffect(() => {
    console.log('IdeasFetcher: isAuthenticated changed to:', isAuthenticated);
    console.log('IdeasFetcher: current ideas count:', ideas.length);

    if (isAuthenticated) {
      console.log('IdeasFetcher: Fetching ideas...');
      fetchIdeas();
    }
  }, [isAuthenticated, fetchIdeas]);

  // Debug ideas changes
  useEffect(() => {
    console.log('IdeasFetcher: Ideas changed, count:', ideas.length);
  }, [ideas]);

  // This component doesn't render anything
  return null;
};

export default IdeasFetcher;
