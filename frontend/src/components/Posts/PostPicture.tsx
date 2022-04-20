import { Box, Icon, Image } from '@chakra-ui/react';
import { AiOutlinePicture } from 'react-icons/ai';
import { IPostPictureProps } from '../../interfaces/props';

const PostPicture = ({ coverImage, author }: IPostPictureProps) => {
  return (
    <Box my="1.5rem" borderRadius="10px">
      {coverImage !== '[]' ? (
        <Image borderRadius="10px" src={coverImage} alt={author} />
      ) : (
        <Icon
          borderRadius="10px"
          as={AiOutlinePicture}
          height="120px"
          width="100%"
          color="purple.secondary"
        />
      )}
    </Box>
  );
};
export default PostPicture;
