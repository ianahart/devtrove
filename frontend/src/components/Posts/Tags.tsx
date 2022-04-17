import { IPostProps } from '../../interfaces/props';
import { Box, Text } from '@chakra-ui/react';
interface ITagsProps {
  tags: string[];
}

const Tags = ({ tags }: ITagsProps): JSX.Element => {
  return (
    <Box justifyContent="space-around" flexWrap="wrap" display="flex">
      {tags.map((tag, index) => {
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
