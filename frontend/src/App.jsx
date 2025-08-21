import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Scene from './pages/3DScene/3DScene';
import NavBar from './components/NavBar';
import AddIdeaModal from './modals/AddIdeaModal';
import ConnectModal from './modals/ConnectModal';
import IdeaPage from './pages/ideas/IdeaPage/IdeaPage';
import { useIdeasStore } from './store/useIdeasStore';
import { useUIStore } from './store/useUIStore';
import Header from './components/Header1';

// Profile pages
import ProfilePage from './pages/ProfilePage/ProfilePage';
import MyIdeaCardEdit from './pages/MyIdeaPage/MyIdeaCardEdit';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  // UI state from UI store
  const isAddOpen = useUIStore((state) => state.isAddOpen);
  const setIsAddOpen = useUIStore((state) => state.setIsAddOpen);
  const openAddModal = useUIStore((state) => state.openAddModal);
  const openConnect = useUIStore((state) => state.openConnectModal);

  // Data state from ideas store
  const submitIdea = useIdeasStore((state) => state.submitIdea);
  const ideas = useIdeasStore((state) => state.ideas);
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

  // bridge window event from ConnectButton to store action
  useEffect(() => {
    const handler = (e) => openConnect(e.detail || {});
    window.addEventListener('openConnectModal', handler);
    return () => window.removeEventListener('openConnectModal', handler);
  }, [openConnect]);

  // Hide NavBar on mobile when on Profile pages
  const isProfileRoute = location.pathname.startsWith('/profile');

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className='content-layout'>
        {/* 3D Scene - hidden on mobile when modal active */}
        <NavBar
          onAdd={openAddModal}
          onLeft={handleLeft}
          onRight={handleRight}
          hideOnMobile={isProfileRoute}
        />
        <AddIdeaModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleSubmitIdea}
        />
        <ConnectModal />
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
            <Route path='/profile/my-idea/:id' element={<MyIdeaCardEdit />} />
            <Route path='/user/:userId' element={<UserProfilePage />} />

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
