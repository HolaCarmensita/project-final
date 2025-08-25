import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AppLayout from './components/AppLayout';
import IdeasFetcher from './components/IdeasFetcher';
import useAuthStore from './store/useAuthStore';

// Profile pages
import ProfilePage from './pages/ProfilePage/ProfilePage';
import MyIdeaCardEdit from './pages/MyIdeaPage/MyIdeaCardEdit';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Ideas pages
import IdeaPage from './pages/ideas/IdeaPage/IdeaPage';

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Restore auth state from localStorage when app starts / yiu stay logged in after a refresh
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <IdeasFetcher />
      <Routes>
        {/* Auth routes - simple layout */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Main app routes - complex layout */}
        <Route path='/*' element={<AppLayout />} />
      </Routes>
    </>
  );
};

export default App;
