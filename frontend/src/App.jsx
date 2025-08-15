import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scene from './pages/3DScene/3DScene';
import NavBar from './components/NavBar';
import AddIdeaSheet from './components/AddIdeaSheet';
import IdeaPage from './pages/ideas/IdeaPage/IdeaPage';
import { useIdeasStore } from './store/useIdeasStore';
import randomColor from 'randomcolor';

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
  const addIdea = useIdeasStore((state) => state.addIdea);
  const ideas = useIdeasStore((state) => state.ideas);

  // Handlers for NavBar
  const handleAdd = () => setIsAddOpen(true);
  const handleLeft = () => { /* global left navigation logic */ };
  const handleRight = () => { /* global right navigation logic */ };

  // Handler for AddIdeaSheet submission
  const getUniqueColorPair = (() => {
    const usedColors = new Set();
    return () => {
      let orbColor, auraColor, combo;
      do {
        orbColor = randomColor({ luminosity: "bright" });
        const orbH = Number(orbColor.match(/\d+/)?.[0]) || Math.floor(Math.random() * 360);
        const compH = (orbH + 180) % 360;
        auraColor = randomColor({ hue: compH, luminosity: "light" });
        combo = orbColor + "-" + auraColor;
      } while (usedColors.has(combo));
      usedColors.add(combo);
      return { orbColor, auraColor };
    };
  })();

  const handleSubmitIdea = (ideaData) => {
    const { orbColor, auraColor } = getUniqueColorPair();
    addIdea({
      ...ideaData,
      id: Date.now(),
      author: "You",
      role: "Creator",
      likes: 0,
      connections: 0,
      orbColor,
      auraColor,
    });
    setIsAddOpen(false);
  };


  return (
    <Router>
      <div className='app-container'>
        <NavBar
          onAdd={handleAdd}
          onLeft={handleLeft}
          onRight={handleRight}
        />
        <AddIdeaSheet
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
