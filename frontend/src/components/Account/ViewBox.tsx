import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
const ViewBox = () => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box className="account-viewbox" bg={theme === 'dark' ? '#000' : '#FFF'}>
      <Outlet />
    </Box>
  );
};
export default ViewBox;
