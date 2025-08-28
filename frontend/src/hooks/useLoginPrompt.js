import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useLoginPrompt(isAuthenticated) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) return;

    const path = location.pathname || '/';
    const isPublicPath = path === '/' || path === '/ideas' || path.startsWith('/ideas/');
    if (!isPublicPath) return;
    if (path === '/login' || path === '/register') return;

    const hasPrompted = localStorage.getItem('loginPromptShown') === 'true';
    if (hasPrompted) return;

    const timerId = setTimeout(() => {
      localStorage.setItem('loginPromptShown', 'true');
      navigate('/login');
    }, 60000);

    return () => clearTimeout(timerId);
  }, [isAuthenticated, location.pathname, navigate]);
}


