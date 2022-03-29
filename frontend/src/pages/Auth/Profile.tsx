import { Box, Text } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { getStorage } from '../../helpers';
import { http } from '../../helpers/';
const Profile = (): JSX.Element => {
  const [error, setError] = useState();
  const handle = useCallback(async () => {
    try {
      const token = getStorage()?.access_token;
      const userId = getStorage()?.user?.id;

      const options = {
        headers: {
          Authorization: 'Bearer ' + token ? token : ' ',
        },
      };
      const response = await http.get(`account/${userId ? userId : 0}/`, options);
      if (response) {
        return;
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error);
      }
    }
  }, []);

  useEffect(() => {
    handle();
  }, [handle]);
  return (
    <Box>
      <Text fontSize="36px" textAlign="center" color="light.primary">
        Your Profile...
      </Text>
    </Box>
  );
};

export default Profile;
