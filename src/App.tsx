import { Routes, Route, useLocation } from 'react-router-dom';
import './globals.css';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ThemeSwitcher from './components/themeSwitcher'; 
import SpotifyPlayer from './components/SpotifyPlayer';

const App = () => {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
};

const MainContent = () => {
  const { theme } = useTheme();
  const location = useLocation();  // ⭐ URL'yi kontrol etmek için useLocation kullandık

  // Sign-in ve Sign-up sayfalarında Spotify görünmesin:
  const shouldShowSpotify = !['/sign-in', '/sign-up'].includes(location.pathname);

  return (
    <main className={`flex h-screen ${theme === 'light' ? 'bg-primary-try' : 'bg-primary-beige-200'}`}>
      <ThemeSwitcher />

      {/* Yalnızca belirli sayfalarda Spotify Player göster */}
      {shouldShowSpotify && (
        <SpotifyPlayer 
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5l"
          title="Chill Playlist"
        />
      )}
      
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
