import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import { GlobalContext } from '../../../context/global';
import { IGlobalContext } from '../../../interfaces/';
import PasswordFormContainer from '../../Forms/PasswordFormContainer';

const Security = () => {
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box>
      <PasswordFormContainer
        refresh_token={userAuth.refresh_token ?? ''}
        helperText="After changing your password you will be logged out and can login again with your new password."
        extraField={true}
        endpoint={`/auth/${userAuth.user.id}/change-password/`}
        btnText="Change Password"
        title="Password & Security"
      />
    </Box>
  );
};

export default Security;
