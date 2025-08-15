import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scene from './pages/3DScene/3DScene';
import NavBar from './components/NavBar';
import AddIdeaModal from './modals/AddIdeaModal';
import IdeaPage from './pages/ideas/IdeaPage/IdeaPage';
import { useIdeasStore } from './store/useIdeasStore';

// Profile pages
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ProfileIdeas from './pages/ProfilePage/ProfileIdeas';
import ProfileConnections from './pages/ProfilePage/ProfileConnections';
import ProfileLiked from './pages/ProfilePage/ProfileLiked';
import ProfileSettings from './pages/ProfilePage/ProfileSettings';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

export const App = () => {
  const isAddOpen = useIdeasStore((state) => state.isAddOpen);
  const setIsAddOpen = useIdeasStore((state) => state.setIsAddOpen);
  const submitIdea = useIdeasStore((state) => state.submitIdea);
  const ideas = useIdeasStore((state) => state.ideas);
  const openAddModal = useIdeasStore((state) => state.openAddModal);
  const handleLeftStore = useIdeasStore((state) => state.handleLeft);
  const handleRightStore = useIdeasStore((state) => state.handleRight);

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
    <Router>
      <div className='app-container'>
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
        <div className='background-layer'>
          <Scene ideas={ideas} />
        </div>
        <div className='overlay-layer'>
          <Routes>
            <Route path='/' element={null} />
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
    </Router>
  );
};
