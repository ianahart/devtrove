import { Box, Text } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { getStorage } from '../../helpers';
import { http } from '../../helpers/';
const Profile = (): JSX.Element => {
  return (
    <Box>
      <Text fontSize="36px" textAlign="center" color="light.primary">
        Your Profile...
      </Text>
    </Box>
  );
};

export default Profile;
