import { Box, Text } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useCallback, useEffect } from 'react';
import Logout from '../../components/Auth/Logout';
import { getStorage } from '../../helpers';
import { http } from '../../helpers/';
const Profile = (): JSX.Element => {
  const handle = useCallback(async () => {
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + getStorage().access_token,
        },
      };
      const response = await http.get(`account/${getStorage().user.id}/`, options);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
      }
    }
  }, []);

  useEffect(() => {
    handle();
  }, [handle]);
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
