import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/global';
import { IGlobalContext, IPostsContext } from '../interfaces';
import BasicModal from '../components/Mixed/BasicModal';
import LoginForm from '../components/Forms/LoginForm';
import { useContext } from 'react';
import { PostsContext } from '../context/posts';
const Login = () => {
  const navigate = useNavigate();
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const { setIsLoaded, setPosts } = useContext(PostsContext) as IPostsContext;

  useEffect(() => {
    setIsLoaded(false);
    setPosts([]);
  }, [setIsLoaded, setPosts]);

  useEffect(() => {
    if (userAuth.user.logged_in) {
      navigate('/');
    }
  }, [userAuth.user.logged_in, navigate]);

  return (
    <Box>
      <BasicModal resetForm={undefined}>
        <LoginForm />
      </BasicModal>
    </Box>
  );
};

export default Login;
