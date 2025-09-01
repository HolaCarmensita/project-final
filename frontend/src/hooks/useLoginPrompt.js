import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useLoginPrompt(isAuthenticated) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) return;

    const path = location.pathname || '/';

    // Allow users to see the home page without being logged in
    if (path === '/') return;

    // Don't redirect if already on auth pages
    if (path === '/login' || path === '/register') return;

    // Redirect to login immediately for any other interaction
    navigate('/login');
  }, [isAuthenticated, location.pathname, navigate]);
}
