import { useEffect, useContext } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { http } from '../helpers';
const Home = (): JSX.Element => {
  const handleOnClick = async () => {
    try {
      const response = await http.get('posts/');
      console.log('Posts: ');
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
