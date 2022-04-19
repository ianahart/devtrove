import { Box, Heading, Icon, Image, Link, Text, Tooltip } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { AiOutlinePicture } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import axios, { AxiosError } from 'axios';
import { IBookmark } from '../../interfaces';
import { IBookmarkProps } from '../../interfaces/props';
import Tags from '../Posts/Tags';

const Bookmark = ({ deleteBookmark, bookmark }: IBookmarkProps) => {
  const handleOnClick = (id: number) => {
    deleteBookmark(id);
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
          <Image
            mb="0.5rem"
            width="40px"
            height="40px"
            borderRadius="8px"
            src={bookmark.post.logo}
            alt="the logo from the site where this was written"
          />
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
          <Link textAlign="center" color="#FFF" href={bookmark.post.details_url}>
            <Heading mb="1.5rem" textAlign="center" color="#FFF" as="h3" fontSize="26px">
              {bookmark.post.title}
            </Heading>
          </Link>

          {bookmark.post.cover_image !== '[]' ? (
            <Image
              mb="1.2rem"
              src={bookmark.post.cover_image}
              alt={bookmark.post.author}
            />
          ) : (
            <Icon
              as={AiOutlinePicture}
              height="120px"
              width="100%"
              mb="1.2rem"
              color="purple.secondary"
            />
          )}
          <Link as={RouterLink} to={`/${bookmark.post.id}${bookmark.post.slug}`}>
            <Tags tags={bookmark.post.tags} />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Bookmark;
