import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import { IGlobalContext } from '../interfaces';
import { GlobalContext } from '../context/global';
import RegisterForm from '../components/Forms/RegisterForm';
import registerBG from '../images/register_bg.png';

const Register: React.FC = () => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box
      display="flex"
      flexDir={['column', 'column', 'row']}
      height="100%"
      minH="100vh"
      justifyContent={['unset', 'unset', 'center']}
      backgroundColor={theme === 'dark' ? '#000' : '#FFF'}
    >
      <Box
        display={['none', 'none', 'block']}
        backgroundImage={registerBG}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        height="100%"
        minH="100vh"
        width={['100%', '100%', '60%']}
      ></Box>
      <Box margin="0 auto" p="1rem" width={['100%', '100%', '40%']} maxWidth="700px">
        <RegisterForm />
      </Box>
    </Box>
  );
};
export default Register;
