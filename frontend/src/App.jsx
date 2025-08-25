import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import IdeasFetcher from './components/IdeasFetcher';

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
  return (
    <>
      <IdeasFetcher />
      <Routes>
        {/* Auth routes - simple layout */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Main app routes - complex layout */}
        <Route path='/*' element={<AppLayout />} />
      </Routes>
    </>
  );
};

export default App;
