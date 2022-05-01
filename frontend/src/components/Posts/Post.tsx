import { useContext } from 'react';
import { Box, Heading, Image, Link, Text } from '@chakra-ui/react';
import { IPostProps } from '../../interfaces/props';
import Actions from './Actions';
import Tags from './Tags';
import { IPostsContext, IGlobalContext } from '../../interfaces';
import { PostsContext } from '../../context/posts';
import { GlobalContext } from '../../context/global';
import PostPicture from './PostPicture';
import Logo from '../Mixed/Logo';
const Post = ({ bookmark, post, updatePostUpvote }: IPostProps) => {
  console.log(post);
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const { addToReadHistory } = useContext(PostsContext) as IPostsContext;

  const handleHistory = () => {
    if (userAuth.user.id) {
      addToReadHistory(userAuth.user.id, post.id, post.tags);
    }
  };

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
      {post.logo ? (
        <Image
          mb="0.25rem"
          width="30px"
          height="30px"
          borderRadius="50%"
          boxShadow="lg"
          src={post.logo}
          alt={post.title}
        />
      ) : (
        <Logo textOne="" textTwo="" height="30px" width="30px" fontSize="0" />
      )}

      <Link
        isExternal
        rel="noopener noreferrer"
        onClick={handleHistory}
        textAlign="center"
        color="#FFF"
        href={post.details_url}
      >
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
      <PostPicture coverImage={post.cover_image} author={post.author} />
      {post.tags && <Tags tags={post.tags} />}
      <Box bg="text.secondary" height="2px" width="100%" m="auto auto 0 auto"></Box>

      <Actions
        updatePostUpvote={updatePostUpvote}
        bookmark={bookmark}
        cur_user_bookmarked={post.cur_user_bookmarked}
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
