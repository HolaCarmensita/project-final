import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const location = useLocation();

  // Show loading state while checking authentication or initializing
  if (isLoading || isInitializing) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, allow access to public app views ('/' and '/ideas...')
  if (!isAuthenticated) {
    const path = location.pathname || '/';
    const isPublicPath = path === '/' || path === '/ideas' || path.startsWith('/ideas/');
    if (isPublicPath) {
      return children;
    }
    return <Navigate to='/login' replace />;
  }

  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;
