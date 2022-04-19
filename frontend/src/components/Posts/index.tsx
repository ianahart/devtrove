import { Grid, Box } from '@chakra-ui/react';
import Post from './Post';
import { IPostsProps } from '../../interfaces/props';
const Posts = ({ posts, bookmark, updatePostUpvote }: IPostsProps): JSX.Element => {
  return (
    <Box
      flexGrow="2"
      width="100%"
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

export default Posts;
