import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import MainMenu from '../../components/Account/MainMenu';
import { Outlet } from 'react-router-dom';
const Account: React.FC = () => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box minHeight="100vh" width="100%" bg={theme === 'dark' ? '#000' : '#fff'}>
      <Box className="account-container">
        <MainMenu />
        <Outlet />
      </Box>
    </Box>
  );
};
export default Account;
