import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AppLayout from './components/AppLayout';
import IdeasFetcher from './components/IdeasFetcher';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import useAuthStore from './store/useAuthStore';
import useUserStore from './store/useUserStore';
import useAuthInitializer from './hooks/useAuthInitializer';
import useUserProfileLoader from './hooks/useUserProfileLoader';
import useLoginPrompt from './hooks/useLoginPrompt';

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
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  useAuthInitializer();

  // (handled by useAuthInitializer)

  useUserProfileLoader(isAuthenticated);
  useLoginPrompt(isAuthenticated);

  return (
    <>
      <IdeasFetcher />
      <Routes>
        {/* Auth routes - public but redirect if authenticated */}
        <Route
          path='/login'
          element={
            <PublicRoute>
              <>
                <AppLayout />
                <LoginPage />
              </>
            </PublicRoute>
          }
        />
        <Route
          path='/register'
          element={
            <PublicRoute>
              <>
                <AppLayout />
                <RegisterPage />
              </>
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
