import { Box, Button, Grid } from '@chakra-ui/react';
import { useContext } from 'react';
import Post from './Post';
import { IPostsProps } from '../../interfaces/props';
import { IPostsContext } from '../../interfaces';
import { PostsContext } from '../../context/posts';
import Search from '../../components/Search';
const Posts = ({
  paginatePosts,
  posts,
  bookmark,
  updatePostUpvote,
}: IPostsProps): JSX.Element => {
  const { pagination } = useContext(PostsContext) as IPostsContext;
  return (
    <Box
      flexGrow="2"
      width="300px"
      height="100%"
      minH="100vh"
      border="1px solid #403d40"
      borderTopColor="transparent"
      color="#FFF"
      textAlign="center"
      fontSize="1rem"
      margin="0 auto"
      p="0.5rem"
    >
      <Search />
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
      {pagination.has_next && (
        <Box my="2rem" display="flex" justifyContent="center">
          <Button variant="secondaryButton" onClick={paginatePosts}>
            Load more...
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Posts;
