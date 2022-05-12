import { Box, Grid, Heading } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import GoBack from '../components/Mixed/GoBack';
import Spinner from '../components/Mixed/Spinner';
import { PostsContext } from '../context/posts';
import { IPostsContext, IPost } from '../interfaces';
import { http } from '../helpers';
import Post from '../components/Posts/Post';

interface IUpvotedRequest {
  posts: IPost[];
  message?: string;
}

const UpVoted = () => {
  const { bookmark, setIsLoaded, posts, updatePostUpvote, setPosts } = useContext(
    PostsContext
  ) as IPostsContext;

  const [spinner, setSpinner] = useState(false);
  const fetchUpvoted = useCallback(async () => {
    try {
      setPosts([]);
      const response = await http.get<IUpvotedRequest>(`/posts/upvoted/`);
      setPosts(response.data.posts);
      setSpinner(true);
    } catch (e: unknown | AxiosError) {
      setSpinner(true);
    }
  }, [setPosts]);
  useEffect(() => {
    fetchUpvoted();
    setIsLoaded(false);
  }, [fetchUpvoted, setIsLoaded]);

  return (
    <Box position="relative">
      {!spinner && <Spinner text="Loading upvoted articles.." />}
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
        Upvoted
      </Heading>
      {posts.length > 0 && (
        <Grid mb="1rem" className="posts-grid">
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
    </Box>
  );
};

export default UpVoted;
