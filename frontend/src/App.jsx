import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scene from './pages/3DScene/3DScene';
import NavBar from './components/NavBar';
import IdeaPage from './pages/ideas/IdeaPage/IdeaPage';

// Profile pages
import ProfilePage from './pages/Profile/ProfilePage';
import ProfileIdeas from './pages/Profile/ProfileIdeas';
import ProfileConnections from './pages/Profile/ProfileConnections';
import ProfileLiked from './pages/Profile/ProfileLiked';
import ProfileSettings from './pages/Profile/ProfileSettings';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

export const App = () => {
  return (
    <Router>
      <div className='app-container'>
        <NavBar />
        <div className='background-layer'>
          <Scene velocity={0} />
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
