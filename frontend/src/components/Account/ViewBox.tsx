import { Outlet } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
const ViewBox = () => {
  return (
    <Box className="account-viewbox" bg="#000">
      <Outlet />
      <Text fontSize="42px" color="blue">
        View Box
      </Text>
    </Box>
  );
};
export default ViewBox;
