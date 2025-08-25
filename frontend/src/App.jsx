import { useLocation, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AppLayout from './components/AppLayout';
import IdeasFetcher from './components/IdeasFetcher';
import useAuthStore from './store/useAuthStore';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Restore auth state from localStorage when app starts / you stay logged in after a refresh
    initializeAuth();
  }, []); // Remove initializeAuth dependency to prevent re-renders

  const location = useLocation();
  // If navigating to /login or /register, show modal over previous location
  const state = location.state && location.state.backgroundLocation ? location.state : undefined;

  return (
    <>
      <IdeasFetcher />
      <Routes location={state?.backgroundLocation || location}>
        {/* Main app routes - complex layout */}
        <Route path='/*' element={<AppLayout />} />
      </Routes>
      {/* Show modal if route is /login or /register */}
      {location.pathname === '/login' && <LoginPage />}
      {location.pathname === '/register' && <RegisterPage />}
    </>
  );
};

export default App;
