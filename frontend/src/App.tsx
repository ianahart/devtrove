import { Box } from '@chakra-ui/react';
import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { IGlobalContext } from './interfaces';
import { GlobalContext } from './context/global';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Auth/Profile';
import Navigation from './components/Navigation/';
import Footer from './components/Footer/';
import BasicModal from './components/Mixed/BasicModal';
import WithAxios from './helpers/WithAxios';
import RequireAuth from './components/Auth/RequireAuth';
import RequireGuest from './components/Auth/RequireGuest';
import Account from './pages/Auth/Account';
import ProfileForm from './components/Account/Profile/ProfileForm';
import Security from './components/Account/Profile/Security';
import ProfileMenu from './components/Account/Profile/ProfileMenu';
import SettingsMenu from './components/Account/Settings/SettingsMenu';
import General from './components/Account/Settings/General';
import User from './components/Account/Settings/User';
import Detail from './components/Posts/Detail';
import Discussed from './pages/Discussed';
import Upvoted from './pages/Upvoted';
import Search from './pages/Search';
import Bookmarks from './pages/Bookmarks';
import Newest from './pages/Newest';
import Login from './pages/Login';
import ReadingHistory from './pages/ReadingHistory';
import ResetPassword from './components/Mixed/ResetPassword';
import ForgotPassword from './components/Mixed/ForgotPassword';
import Editor from './pages/Editor';
import YourDevtrovePosts from './pages/YourDevtrovePosts';
import DevtrovePost from './components/Posts/DevtrovePost';

import './App.css';
import { getStorage } from './helpers';
const App = () => {
  const { setTheme } = useContext(GlobalContext) as IGlobalContext;

  useEffect(() => {
    const storage = getStorage();
    if (storage?.user) {
      setTheme(storage.user.theme);
    }
  }, [setTheme]);

  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Router>
      <WithAxios>
        <Box bg={theme === 'dark' ? '#000' : '#FFF'} className="site">
          <Box>
            <Navigation />
          </Box>
          <Box className="site-content">
            <BasicModal resetForm={undefined}></BasicModal>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <RequireGuest>
                    <Login />
                  </RequireGuest>
                }
              />
              <Route
                path="/register"
                element={
                  <RequireGuest>
                    <Register />
                  </RequireGuest>
                }
              />

              <Route path="/devtrove-post/:id/:slug" element={<DevtrovePost />} />
              <Route path="/posts/discussed" element={<Discussed />} />
              <Route path="/posts/newest" element={<Newest />} />
              <Route path="/posts/upvoted" element={<Upvoted />} />

              <Route
                path="/reset-password"
                element={
                  <RequireGuest>
                    <ResetPassword />
                  </RequireGuest>
                }
              />

              <Route
                path="/your-devtrove-posts"
                element={
                  <RequireAuth>
                    <YourDevtrovePosts />
                  </RequireAuth>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <RequireGuest>
                    <ForgotPassword />
                  </RequireGuest>
                }
              />
              <Route
                path="/reading-history"
                element={
                  <RequireAuth>
                    <ReadingHistory />
                  </RequireAuth>
                }
              />
              <Route
                path="/editor"
                element={
                  <RequireAuth>
                    <Editor />
                  </RequireAuth>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <RequireAuth>
                    <Bookmarks />
                  </RequireAuth>
                }
              />
              <Route
                path="/:username/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/:username/account"
                element={
                  <RequireAuth>
                    <Account />
                  </RequireAuth>
                }
              >
                <Route
                  path="settings/"
                  element={
                    <RequireAuth>
                      <SettingsMenu />
                    </RequireAuth>
                  }
                >
                  <Route
                    path="general"
                    element={
                      <RequireAuth>
                        <General />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="user"
                    element={
                      <RequireAuth>
                        <User />
                      </RequireAuth>
                    }
                  />
                </Route>
                <Route
                  path="profile/"
                  element={
                    <RequireAuth>
                      <ProfileMenu />
                    </RequireAuth>
                  }
                >
                  <Route
                    index={false}
                    path="edit"
                    element={
                      <RequireAuth>
                        <ProfileForm />
                      </RequireAuth>
                    }
                  />
                  <Route
                    index={false}
                    path="security"
                    element={
                      <RequireAuth>
                        <Security />
                      </RequireAuth>
                    }
                  />
                </Route>
              </Route>
              <Route path=":id/:slug" element={<Detail />} />
            </Routes>
          </Box>
          <Footer name="DevTrove" year={2022} />
        </Box>
      </WithAxios>
    </Router>
  );
};
export default App;
