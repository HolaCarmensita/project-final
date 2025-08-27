import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AppLayout from './components/AppLayout';
import IdeasFetcher from './components/IdeasFetcher';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
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
    // Restore auth state from localStorage when app starts / you stay logged in after a refresh
    initializeAuth();
  }, []); // Remove initializeAuth dependency to prevent re-renders

  return (
    <>
      <IdeasFetcher />
      <Routes>
        {/* Auth routes - public but redirect if authenticated */}
        <Route
          path='/login'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path='/register'
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Main app routes - protected by authentication */}
        <Route
          path='/*'
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
