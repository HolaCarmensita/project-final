import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Scene from '../pages/3DScene/3DScene';
import NavBar from './NavBar';
import AddIdeaModal from '../modals/AddIdeaModal';
import ConnectModal from '../modals/ConnectModal';
import Header from './Header1';
import { useIdeasStore } from '../store/useIdeasStore';
import { useUIStore } from '../store/useUIStore';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // UI state from UI store
  const isAddOpen = useUIStore((state) => state.isAddOpen);
  const setIsAddOpen = useUIStore((state) => state.setIsAddOpen);
  const openAddModal = useUIStore((state) => state.openAddModal);
  const openConnect = useUIStore((state) => state.openConnectModal);

  // Data state from ideas store
  const ideas = useIdeasStore((state) => state.ideas);

  // Navigation from UI store
  const handleLeftStore = useUIStore((state) => state.handleLeft);
  const handleRightStore = useUIStore((state) => state.handleRight);

  const isModalActive = location.pathname !== '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isProfileRoute = location.pathname.startsWith('/profile');

  // Camera move callback for 3DScene
  const moveCameraToIndex = (idx) => {
    window.dispatchEvent(new CustomEvent('moveCameraToIndex', { detail: idx }));
  };

  // Navigation callback - navigate to idea page
  const navigateToIdea = (idx) => {
    if (ideas.length > 0 && ideas[idx]) {
      const idea = ideas[idx];
      if (idea.id) {
        navigate(`/ideas/${idea.id}`);
      } else {
        navigate('/ideas');
      }
    }
  };

  const handleLeft = () =>
    handleLeftStore((idx) => {
      moveCameraToIndex(idx);
      navigateToIdea(idx);
    });

  const handleRight = () =>
    handleRightStore((idx) => {
      moveCameraToIndex(idx);
      navigateToIdea(idx);
    });

  // Handler for AddIdeaModal submission
  const handleSubmitIdea = (ideaData) => {
    const createIdea = useIdeasStore.getState().createIdea;
    createIdea(ideaData);
    setIsAddOpen(false);
  };

  // Bridge window event from ConnectButton to store action
  useEffect(() => {
    const handler = (e) => openConnect(e.detail || {});
    window.addEventListener('openConnectModal', handler);
    return () => window.removeEventListener('openConnectModal', handler);
  }, [openConnect]);

  return (
    <div className='app-container'>
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
          <Header />
          <Scene ideas={ideas} />
        </div>

        {/* profile and idea page here*/}
        <div
          className={`modal-container ${isModalActive ? 'active' : ''} ${
            isAuthPage ? 'auth-modal' : ''
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
