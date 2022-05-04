import { Box, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import Sidebar from '../components/Groups/Sidebar';
import Options from '../components/Groups/Options';
import { GlobalContext } from '../context/global';
import { IGlobalContext } from '../interfaces';
import GroupView from '../components/Groups/GroupView';

const Groups = () => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box minH="100vh">
      <Box className="groups-container">
        <Sidebar />
        <Box className="group-view-container">
          <GroupView />
        </Box>
        <Options />
      </Box>
    </Box>
  );
};

export default Groups;
