import { Box, Grid, Heading } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useCallback, useContext, useEffect } from 'react';
import GoBack from '../components/Mixed/GoBack';
import { PostsContext } from '../context/posts';
import { IAllPostsRequest } from '../interfaces/requests';
import { IPostsContext } from '../interfaces';
import Post from '../components/Posts/Post';
import { IPost } from '../interfaces';
import { http } from '../helpers';

const Newest = () => {
  const { bookmark, setPosts, updatePostUpvote, posts } = useContext(
    PostsContext
  ) as IPostsContext;

  const fetchNewest = useCallback(async () => {
    try {
      const response = await http.get<IAllPostsRequest>('/posts/newest/');
      console.log(response);
      setPosts(response.data.posts);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
      }
    }
  }, [setPosts]);
  useEffect(() => {
    fetchNewest();
  }, [fetchNewest]);
  return (
    <Box>
      <GoBack />
      <Heading
        fontFamily="IM Fell English SC, sans-serif"
        my="3rem"
        textAlign="center"
        as="h1"
        fontSize="36px"
        color="text.primary"
      >
        Newest
      </Heading>

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
    </Box>
  );
};

export default Newest;
