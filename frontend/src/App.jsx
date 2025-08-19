import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Scene from './pages/3DScene/3DScene';
import NavBar from './components/NavBar';
import AddIdeaModal from './modals/AddIdeaModal';
import IdeaPage from './pages/ideas/IdeaPage/IdeaPage';
import { useIdeasStore } from './store/useIdeasStore';
import Header from './components/Header1';

// Profile pages
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ProfileIdeas from './pages/ProfilePage/ProfileIdeas';
import ProfileConnections from './pages/ProfilePage/ProfileConnections';
import ProfileLiked from './pages/ProfilePage/ProfileLiked';
import ProfileSettings from './pages/ProfilePage/ProfileSettings';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const isAddOpen = useIdeasStore((state) => state.isAddOpen);
  const setIsAddOpen = useIdeasStore((state) => state.setIsAddOpen);
  const submitIdea = useIdeasStore((state) => state.submitIdea);
  const ideas = useIdeasStore((state) => state.ideas);
  const openAddModal = useIdeasStore((state) => state.openAddModal);
  const handleLeftStore = useIdeasStore((state) => state.handleLeft);
  const handleRightStore = useIdeasStore((state) => state.handleRight);
  const isModalActive = location.pathname !== '/';

  // Check if current route is an auth page (login/register)
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  // Modal logic: currently shows modal on all routes except home (/)
  // To change this, modify the condition below:
  // - Only /ideas: location.pathname === '/ideas'
  // - Multiple routes: ['/ideas', '/profile'].includes(location.pathname)
  // - Route pattern: location.pathname.startsWith('/ideas')

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    console.log('Theme toggled to:', !isDarkMode ? 'dark' : 'light');
  };

  // Camera move callback for 3DScene
  const moveCameraToIndex = (idx) => {
    // Custom event for 3DScene to listen and move camera
    window.dispatchEvent(new CustomEvent('moveCameraToIndex', { detail: idx }));
  };

  const handleLeft = () => handleLeftStore(moveCameraToIndex);
  const handleRight = () => handleRightStore(moveCameraToIndex);

  // Handler for AddIdeaModal submission
  const handleSubmitIdea = (ideaData) => {
    submitIdea(ideaData);
    setIsAddOpen(false);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className='content-layout'>
        {/* 3D Scene - hidden on mobile when modal active */}
        <NavBar
          onAdd={openAddModal}
          onLeft={handleLeft}
          onRight={handleRight}
        />
        <AddIdeaModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleSubmitIdea}
        />
        <div
          className={`scene-container ${
            isModalActive ? 'hidden-on-mobile' : ''
          }`}
        >
          <Header onThemeToggle={handleThemeToggle} />
          <Scene ideas={ideas} />
        </div>

        {/* Modal - full screen on mobile when active */}
        <div
          className={`modal-container ${isModalActive ? 'active' : ''} ${
            isAuthPage ? 'auth-modal' : ''
          }`}
        >
          <Routes>
            <Route path='/' element={null} />
            <Route path='/ideas/' element={<IdeaPage />} />

            <Route path='/ideas/:id' element={<IdeaPage />} />

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
