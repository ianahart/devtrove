import { Box } from '@chakra-ui/react';
import Sidebar from '../components/Groups/Sidebar';
import Options from '../components/Groups/Options';
import GroupView from '../components/Groups/Group/GroupView';
import { Outlet } from 'react-router-dom';

const Groups = () => {
  return (
    <Box minH="100vh">
      <Box className="groups-container">
        <Sidebar />
        <Box className="group-view-container">
          <Outlet />
        </Box>
        <Options />
      </Box>
    </Box>
  );
};

export default Groups;
