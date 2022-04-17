import { Grid, Box } from '@chakra-ui/react';
import Post from './Post';
import { IPostsProps } from '../../interfaces/props';
const Posts = ({ posts, bookmark, updatePostUpvote }: IPostsProps): JSX.Element => {
  return (
    <Box margin="0 auto" p="0.5rem">
      <Grid
        templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(3, 1fr)']}
        gap={6}
      >
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
