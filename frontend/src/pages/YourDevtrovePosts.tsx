import { Box, Text } from '@chakra-ui/react';
import GoBack from '../components/Mixed/GoBack';

const YourDevtrovePosts = () => {
  return (
    <>
      <GoBack />
      <Box margin="0 auto" width="400px" height="300px" bg="#FFF">
        <Text>Your posts go here</Text>
      </Box>
    </>
  );
};

export default YourDevtrovePosts;
