import { Box, Button, Heading } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { http } from '../helpers';
import { IPost } from '../interfaces';
import Posts from '../components/Posts/';
import Spinner from '../components/Mixed/Spinner';

const Home = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [error, setError] = useState('');
  const handleOnClick = async () => {
    try {
      const response = await http.post('/posts/', {
        url: 'https://www.dev.to',
      });
      if (response.status === 201) {
        setIsLoaded(true);
        setPosts(response.data);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
      }
    }
  };

  const preformUpdate = (post: IPost, id: number, dir: string) => {
    if (post.id === id) {
      if (dir === 'upvote') {
        post.cur_user_voted = true;
        console.log('upvote');
        post.upvotes_count = post.upvotes_count + 1;
      } else if (dir === 'downvote') {
        console.log('downvote');
        post.cur_user_voted = false;
        post.upvotes_count = post.upvotes_count === 0 ? 0 : post.upvotes_count - 1;
      }
    }
    return post;
  };

  const updatePostUpvote = (id: number, dir: string) => {
    const updated = [...posts].map((post) => {
      return preformUpdate(post, id, dir);
    });
    setPosts(updated);
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await http.get<IPost[]>('/posts/');
      if (response.status === 200) {
        setPosts(response.data);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.error);
      }
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Box height="100%" minH="100vh">
      {posts.length === 0 && !error.length && (
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
        <Button onClick={handleOnClick} variant="secondaryButton">
          Scrape
        </Button>
      </Box>
      {error.length > 0 && (
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
      {posts.length && <Posts updatePostUpvote={updatePostUpvote} posts={posts} />}
    </Box>
  );
};
export default Home;
