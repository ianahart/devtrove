import { IPostProps } from '../../interfaces';
import { Box, Text } from '@chakra-ui/react';

const Tags = ({ post }: IPostProps): JSX.Element => {
  return (
    <Box justifyContent="space-around" flexWrap="wrap" display="flex">
      {post.tags.map((tag, index) => {
        return (
          <Text
            fontSize="1rem"
            borderRadius="12px"
            bg="text.tertiary"
            py="0.15rem"
            px="0.4rem"
            m="0.3rem"
            key={index}
            color="#FFF"
          >
            {tag}
          </Text>
        );
      })}
    </Box>
  );
};

export default Tags;
