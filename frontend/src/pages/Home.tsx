import { Box } from '@chakra-ui/react';
import axios from 'axios';
const Home = (): JSX.Element => {
  const handleOnClick = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/api/v1/account/all',
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  return <Box></Box>;
};
export default Home;
