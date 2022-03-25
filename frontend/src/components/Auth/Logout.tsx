import { Box, Button } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { http } from '../../helpers';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
import { ILogoutRequest } from '../../interfaces/requests';
const Logout = () => {
  const navigate = useNavigate();
  const { userAuth, logout } = useContext(GlobalContext) as IGlobalContext;

  const handleOnClick = async () => {
    try {
      const options = {
        headers: { Authorization: `Bearer ${userAuth.access_token}` },
      };
      if (!userAuth) {
        return;
      }
      const response = await http.post<ILogoutRequest>(
        'auth/logout/',
        {
          pk: userAuth.user.id ?? null,
          refresh_token: userAuth.refresh_token,
        },
        options
      );
      if (response.status === 200) {
        logout();
        navigate('/');
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e) && e.response) {
        console.log('logout error');
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
