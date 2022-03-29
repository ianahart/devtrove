import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Auth/Profile';
import Navigation from './components/Navigation/';
import Footer from './components/Footer/';
import './App.css';
import BasicModal from './components/Mixed/BasicModal';
import WithAxios from './helpers/WithAxios';
import LoginForm from './components/Forms/LoginForm';
import RequireAuth from './components/Auth/RequireAuth';
import Account from './pages/Auth/Account';
import ProfileForm from './components/Account/ProfileForm';
import Security from './components/Account/Security';
import ProfileMenu from './components/Account/ProfileMenu';
import Settings from './components/Account/Settings';
const App = () => {
  return (
    <Router>
      <WithAxios>
        <Box bgColor="black.primary" className="site">
          <Box>
            <Navigation />
          </Box>
          <Box className="site-content">
            <BasicModal>
              <LoginForm />
            </BasicModal>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
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
                  path="settings"
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  }
                />

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
            </Routes>
          </Box>
          <Footer name="DevTrove" year={2022} />
        </Box>
      </WithAxios>
    </Router>
  );
};
export default App;
