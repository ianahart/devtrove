import { useContext } from 'react';
import { Box, Heading, Icon, Image, Link, Text, Tooltip } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BsBookmark } from 'react-icons/bs';
import { IBookmarkProps } from '../../interfaces/props';
import { IPostsContext, IGlobalContext } from '../../interfaces';
import { PostsContext } from '../../context/posts';
import { GlobalContext } from '../../context/global';
import PostPicture from '../Posts/PostPicture';
import Tags from '../Posts/Tags';
import Logo from '../Mixed/Logo';

const Bookmark = ({ deleteBookmark, bookmark }: IBookmarkProps) => {
  const { addToReadHistory } = useContext(PostsContext) as IPostsContext;
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;

  const handleOnClick = (id: number) => {
    deleteBookmark(id);
  };

  const handleHistory = () => {
    if (userAuth.user.id) {
      addToReadHistory(userAuth.user.id, bookmark.post.id, bookmark.post.tags);
    }
  };

  return (
    <Box
      p="0.5rem"
      borderColor="text.secondary"
      border="1px solid"
      justifySelf="center"
      width="300px"
      minH="380px"
      borderRadius="8px"
      bg="cover.primary"
    >
      <Box display="flex" flexDir="column">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {bookmark.post.logo ? (
            <Image
              mb="0.5rem"
              width="40px"
              height="40px"
              borderRadius="8px"
              src={bookmark.post.logo}
              alt="the logo from the site where this was written"
            />
          ) : (
            <Logo textOne="" height="30px" width="30px" fontSize="12px" textTwo="" />
          )}
          <Tooltip label="Remove bookmark" hasArrow placement="top-end">
            <Box as="span">
              <Icon
                onClick={() => handleOnClick(bookmark.id)}
                cursor="pointer"
                color="#efbb29"
                fontSize="1.5rem"
                as={BsBookmark}
              />
            </Box>
          </Tooltip>
        </Box>
        <Box display="flex" alignItems="center">
          <Image
            mr="1rem"
            borderRadius="50%"
            boxShadow="md"
            height="40px"
            width="40px"
            src={bookmark.post.author_pic}
            alt={bookmark.post.author}
          />
          <Text color="purple.tertiary">{bookmark.post.author}</Text>
        </Box>
        <Box display="flex" alignItems="center" flexDir="column">
          <Link
            isExternal
            rel="noopener noreferrer"
            onClick={handleHistory}
            textAlign="center"
            color="#FFF"
            href={bookmark.post.details_url}
          >
            <Heading mb="1.5rem" textAlign="center" color="#FFF" as="h3" fontSize="26px">
              {bookmark.post.title}
            </Heading>
          </Link>
          <PostPicture
            coverImage={bookmark.post.cover_image}
            author={bookmark.post.author}
          />
          <Link as={RouterLink} to={`/${bookmark.post.id}${bookmark.post.slug}`}>
            <Tags tags={bookmark.post.tags} />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Bookmark;
