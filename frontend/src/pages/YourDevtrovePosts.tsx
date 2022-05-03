import { Box, Heading, Text } from '@chakra-ui/react';
import GoBack from '../components/Mixed/GoBack';
import DevtrovePosts from '../components/Posts/DevtrovePosts';
import DevtrovePostList from '../components/Posts/DevtrovePostList';
import { useContext } from 'react';
import { PostsContext } from '../context/posts';
import { IPostsContext } from '../interfaces';

const YourDevtrovePosts = () => {
  const { posts } = useContext(PostsContext) as IPostsContext;

  return (
    <>
      <Box margin="0 auto">
        <Box display="flex" flexDir={['column', 'column', 'row']}>
          <Box
            borderRight="1px solid"
            borderColor="text.secondary"
            minH="100vh"
            width={['100%', '100%', '250px']}
          >
            <GoBack />
            <DevtrovePostList posts={posts} />
          </Box>
          <Box flexGrow="2">
            <Heading
              width="300px"
              textAlign="center"
              fontFamily="IM Fell English SC, sans-serif"
              margin="3rem auto 3rem auto"
              as="h1"
              fontSize="36px"
              color="text.primary"
            >
              Your Posts
            </Heading>

            <DevtrovePosts endpoint="/posts/devtrove-posts/" ownership="private" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default YourDevtrovePosts;
