import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Navigation from './components/Navigation/';
import Footer from './components/Footer/';
import './App.css';
import BasicModal from './components/Mixed/BasicModal';
import LoginForm from './components/Forms/LoginForm';

const App = () => {
  return (
    <Router>
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
          </Routes>
        </Box>
        <Footer name="DevTrove" year={2022} />
      </Box>
    </Router>
  );
};
export default App;
