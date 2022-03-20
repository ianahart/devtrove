import { useContext } from 'react';
import { Box, Button } from '@chakra-ui/react';
import axios from 'axios';
import { GlobalContext } from '../context/global';
import { IGlobalContext } from '../interfaces';
const Home = (): JSX.Element => {
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;

  const handleOnClick = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/api/v1/posts/',
        headers: {
          Authorization: 'Bearer ' + userAuth.access_token,
        },
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box>
      <Button onClick={handleOnClick}>Test auth</Button>
    </Box>
  );
};
export default Home;
