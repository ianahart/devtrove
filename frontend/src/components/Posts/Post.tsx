import { Box, Heading, Image, Link, Text } from '@chakra-ui/react';
import { IPostProps } from '../../interfaces';
const Post = ({ post }: IPostProps) => {
  return (
    <Box
      as="article"
      border="1px solid"
      borderColor="text.primary"
      borderRadius="8px"
      padding="0.5rem"
      backgroundColor="#000"
      boxShadow="lg"
      maxW="300px"
      width="100%"
      minH="300px"
      justifySelf="center"
    >
      <Link textAlign="center" color="#FFF" href={post.details_url}>
        <Heading as="h3" fontSize="22px">
          {post.title}
        </Heading>
      </Link>
      <Box
        fontSize="14px"
        color="text.primary"
        display="flex"
        justifyContent="flex-start"
        my="1.75rem"
      >
        <Text mx="0.5rem">{post.published_date}</Text>
        <Box color="purple.secondary" as="span">
          {' '}
          &#124;{' '}
        </Box>
        <Text mx="0.5rem">{post.min_to_read}</Text>
      </Box>
      <Box my="1.5rem">
        {post.cover_image !== '[]' ? (
          <Image src={post.cover_image} alt={post.author} />
        ) : (
          <></>
        )}
      </Box>
      <Box justifyContent="space-around" flexWrap="wrap" display="flex">
        {post.tags.map((tag, index) => {
          return (
            <Text mx="0.3rem" key={index} color="#FFF">
              {tag}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
};
export default Post;
