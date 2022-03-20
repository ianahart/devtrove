import { Box, Button } from '@chakra-ui/react';
import { useEffect, useState, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
import { ILogoutRequest } from '../../interfaces/requests';
const Logout = () => {
  const { userAuth, logout } = useContext(GlobalContext) as IGlobalContext;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      logout();
    }
  }, [logout, isLoaded]);

  const handleOnClick = async () => {
    try {
      const options = {
        headers: { Authorization: `Bearer ${userAuth.access_token}` },
      };
      const response = await axios.post<ILogoutRequest>(
        '/api/v1/auth/logout/',
        {
          pk: userAuth.user.id,
          refresh_token: userAuth.refresh_token,
        },
        options
      );
      if (response.status === 200) {
        setIsLoaded(true);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e) && e.response) {
        if ([401, 403].includes(e.response.status)) {
          setIsLoaded(true);
        }
      }
    }
  };

  return (
    <Box>
      <Button
        onClick={handleOnClick}
        _hover={{ backgroundColor: '#C42CB0' }}
        bg="purple.primary"
        color="#FFF"
      >
        Logout
      </Button>
    </Box>
  );
};

export default Logout;
