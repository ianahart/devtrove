import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Auth/Profile';
import Navigation from './components/Navigation/';
import Footer from './components/Footer/';
import BasicModal from './components/Mixed/BasicModal';
import WithAxios from './helpers/WithAxios';
import RequireAuth from './components/Auth/RequireAuth';
import Account from './pages/Auth/Account';
import ProfileForm from './components/Account/Profile/ProfileForm';
import Security from './components/Account/Profile/Security';
import ProfileMenu from './components/Account/Profile/ProfileMenu';
import SettingsMenu from './components/Account/Settings/SettingsMenu';
import General from './components/Account/Settings/General';
import User from './components/Account/Settings/User';
import Detail from './components/Posts/Detail';
import Discussed from './pages/Discussed';
import Popular from './pages/Popular';
import Upvoted from './pages/Upvoted';
import Search from './pages/Search';
import Bookmarks from './pages/Bookmarks';
import Newest from './pages/Newest';
import Login from './pages/Login';
import './App.css';
import ReadingHistory from './pages/ReadingHistory';

const App = () => {
  return (
    <Router>
      <WithAxios>
        <Box bgColor="black.primary" className="site">
          <Box>
            <Navigation />
          </Box>
          <Box className="site-content">
            <BasicModal resetForm={undefined}></BasicModal>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/discussed" element={<Discussed />} />
              <Route path="/posts/newest" element={<Newest />} />
              <Route path="/posts/upvoted" element={<Upvoted />} />
              <Route path="/posts/popular" element={<Popular />} />
              <Route
                path="/reading-history"
                element={
                  <RequireAuth>
                    <ReadingHistory />
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
