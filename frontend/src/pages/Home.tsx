import { Box, Button, Heading } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { IPostsContext } from '../interfaces';
import { PostsContext } from '../context/posts';
import Posts from '../components/Posts/';
import Spinner from '../components/Mixed/Spinner';

const Home = (): JSX.Element => {
  const { updatePostUpvote, bookmark, scrape, postsError, fetchPosts, posts } =
    useContext(PostsContext) as IPostsContext;
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Box height="100%" minH="100vh">
      {posts.length === 0 && !postsError.length && (
        <Box
          flexDir="column"
          alignItems="center"
          display="flex"
          bg="rgba(244, 241, 242, 0.31)"
          position="relative"
          justifyContent="center"
          height="100vh"
        >
          <Spinner text="Loading Articles..." />
        </Box>
      )}

      <Box display="flex" justifyContent="center" my="3rem">
        <Button onClick={scrape} variant="secondaryButton">
          Scrape
        </Button>
      </Box>
      {postsError.length > 0 && (
        <Heading
          textAlign="center"
          as="h2"
          my="1rem"
          fontSize="28px"
          color="purple.secondary"
        >
          There are no posts currently.
        </Heading>
      )}
      {posts.length && (
        <Posts bookmark={bookmark} updatePostUpvote={updatePostUpvote} posts={posts} />
      )}
    </Box>
  );
};
export default Home;
