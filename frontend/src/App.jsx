import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Scene from './pages/3DScene/3DScene';
import IdeaCarousel from './pages/ideas/IdeaCarousel/IdeaCarousel';
import Header from './components/ui/Header';

// Profile pages
import ProfilePage from './pages/Profile/ProfilePage';
import ProfileIdeas from './pages/Profile/ProfileIdeas';
import ProfileConnections from './pages/Profile/ProfileConnections';
import ProfileLiked from './pages/Profile/ProfileLiked';
import ProfileSettings from './pages/Profile/ProfileSettings';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Modal logic: currently shows modal on all routes except home (/)
  // To change this, modify the condition below:
  // - Only /ideas: location.pathname === '/ideas'
  // - Multiple routes: ['/ideas', '/profile'].includes(location.pathname)
  // - Route pattern: location.pathname.startsWith('/ideas')
  const isModalActive = location.pathname !== '/';

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    console.log('Theme toggled to:', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className='content-layout'>
        {/* 3D Scene - hidden on mobile when modal active */}
        <div
          className={`scene-container ${
            isModalActive ? 'hidden-on-mobile' : ''
          }`}
        >
          <Header onThemeToggle={handleThemeToggle} />
          <Scene velocity={0} />
        </div>

        {/* Modal - full screen on mobile when active */}
        <div className={`modal-container ${isModalActive ? 'active' : ''}`}>
          <Routes>
            <Route path='/' element={null} />
            <Route path='/ideas' element={<IdeaCarousel />} />

            {/* Profile routes */}
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/profile/ideas' element={<ProfileIdeas />} />
            <Route
              path='/profile/connections'
              element={<ProfileConnections />}
            />
            <Route path='/profile/liked' element={<ProfileLiked />} />
            <Route path='/profile/settings' element={<ProfileSettings />} />

            {/* Auth routes */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
