import { Box, Button, Text } from '@chakra-ui/react';
import Logout from '../../components/Auth/Logout';

const Profile = (): JSX.Element => {
  return (
    <Box>
      <Text fontSize="36px" textAlign="center" color="blue.primary">
        Your Profile...
      </Text>
      <Logout />
    </Box>
  );
};

export default Profile;
