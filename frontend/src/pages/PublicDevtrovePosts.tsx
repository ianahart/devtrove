import { Box, Heading, Text } from '@chakra-ui/react';
import GoBack from '../components/Mixed/GoBack';
import DevtrovePosts from '../components/Posts/DevtrovePosts';
const PublicDevtrovePosts = () => {
  return (
    <>
      <GoBack />
      <Box margin="0 auto">
        <Heading
          fontFamily="IM Fell English SC, sans-serif"
          my="3rem"
          textAlign="center"
          as="h1"
          fontSize="36px"
          color="text.primary"
        >
          Devtrove posts
        </Heading>

        <DevtrovePosts endpoint="/posts/devtrove-posts/" ownership="public" />
      </Box>
    </>
  );
};

export default PublicDevtrovePosts;
