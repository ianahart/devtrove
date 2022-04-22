import { Box, Grid, Text } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { http, getStorage } from '../../helpers';
import { GlobalContext } from '../../context/global';
import { IFullUser, IGlobalContext } from '../../interfaces';
import Main from '../../components/Profile/Main';
import { IProfileRequest } from '../../interfaces/requests';
import GoBack from '../../components/Mixed/GoBack';

const Profile = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const [profile, setProfile] = useState<IFullUser<object> | null>(null);

  const retrieveProfile = useCallback(async () => {
    try {
      const response = await http.get<IProfileRequest<object>>(
        `/account/profile/${userAuth.user.id}/`
      );
      console.log(response);
      setProfile(response.data.profile);
      setIsLoaded(true);
    } catch (e: unknown | AxiosError) {
      setIsLoaded(true);
      if (axios.isAxiosError(e)) {
        console.log(e.response);
      }
    }
  }, [userAuth.user.id]);

  useEffect(() => {
    if (!isLoaded) {
      retrieveProfile();
    }
  }, [retrieveProfile, isLoaded]);

  return (
    <Grid gridTemplateColumns={['1fr', '1fr', '1fr 2fr 1fr']} minH="100vh" bg="#000">
      <Box display={['none', 'none', 'block']} minH="100vh">
        <GoBack />
      </Box>
      {profile && <Main profile={profile} />}
      <Box display={['none', 'none', 'block']} minH="100vh"></Box>
    </Grid>
  );
};

export default Profile;
