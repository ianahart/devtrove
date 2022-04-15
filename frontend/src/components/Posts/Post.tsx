import { Box, Heading, Icon, Image, Link, Text } from '@chakra-ui/react';
import { IPostProps } from '../../interfaces';
import { AiOutlinePicture } from 'react-icons/ai';
import Actions from './Actions';
import Tags from './Tags';

const Post = ({ post, updatePostUpvote }: IPostProps) => {
  return (
    <Box
      as="article"
      border="1px solid"
      borderColor="text.secondary"
      display="flex"
      justifyContent="space-between"
      flexDir="column"
      borderRadius="8px"
      padding="0.5rem"
      backgroundColor="cover.primary"
      boxShadow="lg"
      maxW="300px"
      width="100%"
      minH="300px"
      flex="auto"
      justifySelf="center"
    >
      <Image
        mb="0.25rem"
        width="30px"
        height="30px"
        borderRadius="50%"
        boxShadow="lg"
        src={post.logo}
        alt={post.title}
      />

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
          <Icon
            as={AiOutlinePicture}
            height="120px"
            width="100%"
            color="purple.secondary"
          />
        )}
      </Box>
      <Tags post={post} />
      <Box bg="text.secondary" height="2px" width="100%" m="auto auto 0 auto"></Box>

      <Actions
        updatePostUpvote={updatePostUpvote}
        upvotes_count={post.upvotes_count}
        cur_user_voted={post.cur_user_voted}
        comments_count={post.comments_count}
        id={post.id}
        slug={post.slug}
      />
    </Box>
  );
};
export default Post;
