import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import Scene from '../pages/3DScene/3DScene';
import NavBar from './NavBar';
import AddIdeaModal from '../modals/AddIdeaModal';
import ConnectModal from '../modals/ConnectModal';
import Header from './Header1';
import { useIdeasStore } from '../store/useIdeasStore';
import { useUIStore } from '../store/useUIStore';
import useAuthStore from '../store/useAuthStore';

import IdeaPage from '../pages/ideas/IdeaPage/IdeaPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import MyIdeaCardEdit from '../pages/MyIdeaPage/MyIdeaCardEdit';
import UserProfilePage from '../pages/UserProfilePage/UserProfilePage';
import ConnectionPage from '../pages/ConnectionPage/ConnectionPage';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // UI state
  const isAddOpen = useUIStore((state) => state.isAddOpen);
  const setIsAddOpen = useUIStore((state) => state.setIsAddOpen);
  const openAddModal = useUIStore((state) => state.openAddModal);
  const openConnect = useUIStore((state) => state.openConnectModal);

  // Ideas data
  const ideas = useIdeasStore((state) => state.ideas);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Navigation handlers
  const handleLeftStore = useUIStore((state) => state.handleLeft);
  const handleRightStore = useUIStore((state) => state.handleRight);

  // Route detection
  const isModalActive = location.pathname !== '/';
  const isProfileRoute = location.pathname.startsWith('/profile');
  const isIdeasRoute = location.pathname.startsWith('/ideas');
  const isConnectionsRoute = location.pathname.startsWith('/connections');
  const shouldShowModal = isIdeasRoute || isProfileRoute || isConnectionsRoute;

  // Animation state
  const [isModalAnimatingOut, setIsModalAnimatingOut] = useState(false);
  const [shouldRenderModal, setShouldRenderModal] = useState(shouldShowModal);
  const [currentModalRoute, setCurrentModalRoute] = useState(
    shouldShowModal ? location.pathname : null
  );

  // Handle modal animation timing
  useEffect(() => {
    if (shouldShowModal && !shouldRenderModal) {
      // Show modal immediately
      setShouldRenderModal(true);
      setIsModalAnimatingOut(false);
      setCurrentModalRoute(location.pathname);
    } else if (!shouldShowModal && shouldRenderModal) {
      // Start hide animation
      setIsModalAnimatingOut(true);
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRenderModal(false);
        setIsModalAnimatingOut(false);
        setCurrentModalRoute(null);
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    } else if (shouldShowModal && shouldRenderModal && !isModalAnimatingOut) {
      // Update route only when not animating
      setCurrentModalRoute(location.pathname);
    }
  }, [
    shouldShowModal,
    shouldRenderModal,
    location.pathname,
    isModalAnimatingOut,
  ]);

  // Navigation handlers
  const handleLeft = () =>
    handleLeftStore((idx) => {
      window.dispatchEvent(
        new CustomEvent('moveCameraToIndex', { detail: idx })
      );
      if (ideas.length > 0 && ideas[idx]) {
        const idea = ideas[idx];
        navigate(idea._id ? `/ideas/${idea._id}` : '/ideas');
      }
    });

  const handleRight = () =>
    handleRightStore((idx) => {
      window.dispatchEvent(
        new CustomEvent('moveCameraToIndex', { detail: idx })
      );
      if (ideas.length > 0 && ideas[idx]) {
        const idea = ideas[idx];
        navigate(idea._id ? `/ideas/${idea._id}` : '/ideas');
      }
    });

  // Add idea handler
  const handleSubmitIdea = (ideaData) => {
    useIdeasStore.getState().createIdea(ideaData);
    setIsAddOpen(false);
  };

  // Connect modal event listener
  useEffect(() => {
    const handler = (e) => openConnect(e.detail || {});
    window.addEventListener('openConnectModal', handler);
    return () => window.removeEventListener('openConnectModal', handler);
  }, [openConnect]);

  return (
    <div className='app-container'>
      <div className='content-layout'>
        <NavBar
          onAdd={() => {
            if (isAuthenticated) {
              openAddModal();
            } else {
              navigate('/login');
            }
          }}
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
            shouldShowModal ? 'scene-container--hidden-mobile' : ''
          }`}
        >
          <Header />
          <Scene ideas={ideas} />
        </div>

        {shouldRenderModal && (
          <div
            className={`modal-container ${
              isModalAnimatingOut ? 'modal-container--hiding' : ''
            }`}
          >
            <Header />
            <div className='modal-content'>
              <Routes location={currentModalRoute}>
                <Route path='/ideas' element={<IdeaPage />} />
                <Route path='/ideas/' element={<IdeaPage />} />
                <Route path='/ideas/:id' element={<IdeaPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route
                  path='/profile/my-idea/:id'
                  element={<MyIdeaCardEdit />}
                />
                <Route path='/user/:userId' element={<UserProfilePage />} />
                <Route
                  path='/connections/:connectionId'
                  element={<ConnectionPage />}
                />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
