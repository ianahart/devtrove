import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/global';
import { IGlobalContext } from '../interfaces';
import BasicModal from '../components/Mixed/BasicModal';
import LoginForm from '../components/Forms/LoginForm';
import { useContext } from 'react';
const Login = () => {
  const navigate = useNavigate();
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;

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
