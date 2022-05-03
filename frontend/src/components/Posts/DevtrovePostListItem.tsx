import { Box, Checkbox, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { PostsContext } from '../../context/posts';
import { IPost, IPostsContext } from '../../interfaces';
import { ICheckedPost } from '../../interfaces';

export interface IDevtrovePostListItemProps {
  post: IPost;
}

const DevtrovePostListItem = ({ post }: IDevtrovePostListItemProps) => {
  const { updateCheckedPost } = useContext(PostsContext) as IPostsContext;
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCheckedPost(post.id, e.target.checked);
  };

  return (
    <Box
      _odd={{ background: '#1b1b1d' }}
      _even={{ background: '#3d3c3a' }}
      p="0.5rem 0.25rem"
      mb="1rem"
    >
      <Box display="flex">
        <Checkbox isChecked={post.is_checked} onChange={handleOnChange} />
        <Text ml="1rem" color="#FFF">
          {post.title}
        </Text>
      </Box>
    </Box>
  );
};

export default DevtrovePostListItem;
