import { Box, Button, Heading } from '@chakra-ui/react';
import { useCallback, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IPostsContext, IGlobalContext } from '../interfaces';
import MainSidebar from '../components/Sidebars/MainSidebar';
import SecondarySidebar from '../components/Sidebars/SecondarySidebar';
import { PostsContext } from '../context/posts';
import { GlobalContext } from '../context/global';
import Posts from '../components/Posts/';
import Spinner from '../components/Mixed/Spinner';

const Home = (): JSX.Element => {
  const location = useLocation();
  const {
    paginatePosts,
    updatePostUpvote,
    isLoaded,
    bookmark,
    setIsLoaded,
    postsError,
    fetchPosts,
    posts,
  } = useContext(PostsContext) as IPostsContext;
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const fetch = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);
  useEffect(() => {
    setIsLoaded(false);
  }, [setIsLoaded, location.pathname]);

  useEffect(() => {
    if (!isLoaded) {
      fetch();
    }
  }, [fetch, isLoaded]);

  return (
    <Box position="relative" height="100%" minH="100vh">
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
        <Box display="flex" flexDir="row" flexShrink="0">
          <MainSidebar />

          <Posts
            paginatePosts={paginatePosts}
            bookmark={bookmark}
            updatePostUpvote={updatePostUpvote}
            posts={posts}
          />
          {userAuth.user.logged_in && <SecondarySidebar />}
        </Box>
      )}
    </Box>
  );
};
export default Home;
