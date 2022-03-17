import { Box } from '@chakra-ui/react';
import RegisterForm from '../components/Forms/RegisterForm';
import registerBG from '../images/register_bg.png';

const Register: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDir={['column', 'column', 'row']}
      height="100%"
      minH="100vh"
      justifyContent={['unset', 'unset', 'center']}
      backgroundColor="black.primary"
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
