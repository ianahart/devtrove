import { Box, Button, Grid, Heading } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import GoBack from '../components/Mixed/GoBack';
import Spinner from '../components/Mixed/Spinner';
import { PostsContext } from '../context/posts';
import { IPostsContext, IPost } from '../interfaces';
import { http } from '../helpers';
import Post from '../components/Posts/Post';

interface IDiscussedRequest {
  posts: IPost[];
  message?: string;
  pagination: { page: number; has_next: boolean };
}

const Discussed = () => {
  const { bookmark, setIsLoaded, posts, updatePostUpvote, setPosts } = useContext(
    PostsContext
  ) as IPostsContext;

  const [pagination, setPagination] = useState({ page: 0, has_next: false });
  const [spinner, setSpinner] = useState(false);
  const fetchDiscussed = useCallback(async () => {
    try {
      setPosts([]);
      const response = await http.get<IDiscussedRequest>(`/posts/discussed/?page=0`);
      setPagination(response.data.pagination);
      setPosts(response.data.posts);
      setSpinner(true);
    } catch (e: unknown | AxiosError) {
      setSpinner(true);
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        if (e.response?.status === 404) {
          setPagination(e.response?.data.pagination);
        }
      }
    }
  }, [setPosts]);
  useEffect(() => {
    fetchDiscussed();
    setIsLoaded(false);
  }, [fetchDiscussed, setIsLoaded]);

  const loadMore = async () => {
    try {
      setSpinner(false);
      const response = await http.get<IDiscussedRequest>(
        `/posts/discussed/?page=${pagination.page}`
      );
      setPagination(response.data.pagination);
      setPosts((prevState: IPost[]) => [...prevState, ...response.data.posts]);

      setSpinner(true);
    } catch (e: unknown | AxiosError) {
      setSpinner(true);
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 404) {
          setPagination(e.response?.data.pagination);
        }

        console.log(e.response);
      }
    }
  };

  return (
    <Box position="relative">
      {!spinner && <Spinner text="Loading most discussed articles.." />}
      <Box onClick={() => setPosts([])}>
        <GoBack />
      </Box>
      <Heading
        fontFamily="IM Fell English SC, sans-serif"
        my="3rem"
        textAlign="center"
        as="h1"
        fontSize="36px"
        color="text.primary"
      >
        Most Activity
      </Heading>
      {posts.length > 0 && (
        <Grid className="posts-grid">
          {posts.map((post) => {
            return (
              <Post
                bookmark={bookmark}
                updatePostUpvote={updatePostUpvote}
                key={post.id}
                post={post}
              />
            );
          })}
        </Grid>
      )}
      {pagination.has_next && spinner && (
        <Box display="flex" justifyContent="center">
          <Button variant="secondaryButton" onClick={loadMore}>
            Load more...
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Discussed;
