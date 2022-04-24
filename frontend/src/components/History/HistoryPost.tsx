import { useContext } from 'react';
import {
  Box,
  Heading,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { IHistoryPostProps } from '../../interfaces/props';
import PostPicture from '../Posts/PostPicture';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiArticleLine } from 'react-icons/ri';
import { IGlobalContext } from '../../interfaces/';
import { GlobalContext } from '../../context/global';

const HistoryPost = ({ deleteHistory, history }: IHistoryPostProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;

  const handleOnClick = () => {
    deleteHistory(history.id);
  };

  const share = (e: React.MouseEvent<HTMLButtonElement>) => {
    const endpoint = `/${history.post_id}${history.post.slug}`;
    const host = (window as any).location.hostname;
    navigator.clipboard.writeText(host + endpoint);
  };

  return (
    <Box
      p="0.5rem"
      my="0.5rem"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box mx="0.25rem" display="flex" alignItems="center">
        <Box mr="1.5rem">
          <Text color={theme === 'dark' ? '#FFF' : '#000'}>{history.readable_date}</Text>
          <Box position="relative" borderRadius="20px" width="175px">
            <Image
              width="40px"
              position="absolute"
              top="15px"
              left="0"
              boxShadow="md"
              borderRadius="20px"
              src={history.post.logo}
              alt="a logo of the website that owns the original article."
            />
            <PostPicture
              coverImage={history.post.cover_image}
              author={history.post.author}
            />
          </Box>
        </Box>
        <Box alignSelf="center" display="flex" flexDir="column">
          <Link as={RouterLink} to={`/${history.post_id}${history.post.slug}`}>
            <Heading color={theme === 'dark' ? '#FFF' : '#000'} fontSize="1rem" as="h2">
              {history.post.title}
            </Heading>
          </Link>
          <Text color="purple.tertiary">&bull; {history.post.min_to_read}</Text>
        </Box>
      </Box>
      <Box display="flex" flexDir="column" justifyContent="space-between">
        <Menu size="100px">
          <MenuButton
            as={IconButton}
            color="text.primary"
            fontSize="25px"
            _hover={{ background: 'transparent' }}
            _active={{ background: 'transparent' }}
            background="transparent"
            border="none"
            aria-label="Options"
            icon={<BsThreeDotsVertical />}
            variant="outline"
          />
          <MenuList bg="text.secondary" border="1px solid" borderColor="text.secondary">
            <MenuItem
              onClick={share}
              icon={<RiArticleLine />}
              color="text.primary"
              _hover={{ background: 'transparent' }}
              _focus={{ background: 'transparent' }}
              _active={{ background: 'transparent' }}
            >
              Share post...
            </MenuItem>
          </MenuList>
        </Menu>
        <Icon
          onClick={handleOnClick}
          alignSelf="center"
          cursor="pointer"
          color="#FFF"
          fontSize="24px"
          as={AiOutlineClose}
        />
      </Box>
    </Box>
  );
};

export default HistoryPost;
