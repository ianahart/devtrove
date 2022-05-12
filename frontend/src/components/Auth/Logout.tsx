import { Box, Button, Icon } from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { http } from '../../helpers';
import { IGlobalContext, IGroupsContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
import { PostsContext } from '../../context/posts';
import { IPostsContext } from '../../interfaces';
import { ILogoutRequest } from '../../interfaces/requests';
import { GroupsContext } from '../../context/groups';

const Logout = () => {
  const navigate = useNavigate();
  const { resetInvitations, resetGroups } = useContext(GroupsContext) as IGroupsContext;
  const { setTheme, setIsSearchOpen, userAuth, logout } = useContext(
    GlobalContext
  ) as IGlobalContext;
  const { clearPosts, setIsLoaded } = useContext(PostsContext) as IPostsContext;
  const [error, setError] = useState('');

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
        navigate('/login');
        clearPosts();
        setTheme('dark');
        setIsLoaded(false);
        setIsSearchOpen(false);
        resetGroups();
        resetInvitations();
        localStorage.removeItem('group_id');
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e) && e.response) {
        setError('Problem logging out.');
      }
    }
  };

  return (
    <Box>
      <Button
        p="0"
        py={['0.5rem', '0.25rem']}
        fontWeight="400"
        fontSize={['1.5rem', '1rem']}
        display="flex"
        alignItems="flex-start"
        backgroundColor="transparent"
        onClick={handleOnClick}
        _hover={{ color: '#707071' }}
        color="text.primary"
      >
        <Icon alignSelf={['center', 'flex-start']} mr="0.25rem" as={AiOutlineLogout} />
        Logout
      </Button>
    </Box>
  );
};

export default Logout;
