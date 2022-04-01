import { Box } from '@chakra-ui/react';
import MainMenu from '../../components/Account/MainMenu';
import { Outlet } from 'react-router-dom';
const Account: React.FC = () => {
  return (
    <Box minHeight="100vh" width="100%" bg="black">
      <Box className="account-container">
        <MainMenu />
        <Outlet />
      </Box>
    </Box>
  );
};
export default Account;
