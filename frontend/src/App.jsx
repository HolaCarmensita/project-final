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
    <AppLayout>
      <IdeasFetcher />
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
    </AppLayout>
  );
};

export default App;
