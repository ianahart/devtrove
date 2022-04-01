import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
const ViewBox = () => {
  return (
    <Box className="account-viewbox" bg="#000">
      <Outlet />
    </Box>
  );
};
export default ViewBox;
