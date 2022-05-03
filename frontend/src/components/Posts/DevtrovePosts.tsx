import { Box, Button, Grid } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PostsContext } from '../../context/posts';
import { IAllPostsRequest } from '../../interfaces/requests';
import { IPostsContext, IPost } from '../../interfaces';
import Post from '../Posts/Post';
import { http } from '../../helpers';

type Ownership = 'public' | 'private';
export interface IDevtrovePostsProps {
  endpoint: string;
  ownership: Ownership;
}

const DevtrovePosts = ({ endpoint, ownership }: IDevtrovePostsProps) => {
  const { bookmark, setPosts, updatePostUpvote, posts } = useContext(
    PostsContext
  ) as IPostsContext;
  const [pagination, setPagination] = useState({ page: 0, has_next: false });
  const [error, setError] = useState('');

  const handleOnClick = async () => {
    try {
      const response = await http.get(
        `${endpoint}?ownership=${ownership}&page=${pagination.page}`
      );
      setPosts((prevState: IPost[]) => [...prevState, ...response.data.posts]);
      setPagination((prevState) => ({ ...prevState, ...response.data.pagination }));
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.error);
      }
    }
  };

  const fetchPosts = useCallback(
    async (endpoint: string, ownership: Ownership) => {
      try {
        const response = await http.get<IAllPostsRequest>(
          `${endpoint}?ownership=${ownership}&page=0`
        );
        setPosts(response.data.posts);
        setPagination((prevState) => ({ ...prevState, ...response.data.pagination }));
      } catch (e: unknown | AxiosError) {
        if (axios.isAxiosError(e)) {
          setError(e.response?.data.error);
        }
      }
    },
    [setPosts]
  );
  useEffect(() => {
    fetchPosts(endpoint, ownership);
  }, [fetchPosts, ownership, endpoint]);
  return (
    <Box mb="1rem">
      <>
        <Grid margin="0 auto" className="posts-grid">
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
        {pagination.has_next && (
          <Box onClick={handleOnClick} my="3rem" display="flex" justifyContent="center">
            <Button variant="entryButton">Load more...</Button>
          </Box>
        )}
      </>
    </Box>
  );
};

export default DevtrovePosts;
