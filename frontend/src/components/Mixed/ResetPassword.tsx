import { Box, Image } from '@chakra-ui/react';
import { useLocation, useSearchParams } from 'react-router-dom';
import PasswordFormContainer from '../Forms/PasswordFormContainer';
import bgImage from '../../images/reset_password.png';
const ResetPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('uid');

  return (
    <Box display="flex" flexDir={['column', 'column', 'row']} height="100%" minH="100vh">
      <Box
        display={['none', 'none', 'block']}
        backgroundImage={bgImage}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        height="100%"
        width={['100%', '100%', '60%']}
        minH="100vh"
      ></Box>
      <Box
        margin="10rem auto 0 auto"
        p="1rem"
        width={['100%', '100%', '40%']}
        maxWidth="700px"
      >
        <PasswordFormContainer
          title="Reset Password"
          helperText="After you reset your password you can login again."
          btnText="Reset Password"
          extraField={false}
          refresh_token={token ?? ''}
          endpoint={`/auth/${userId}/reset-password/`}
        />
      </Box>
    </Box>
  );
};

export default ResetPassword;
