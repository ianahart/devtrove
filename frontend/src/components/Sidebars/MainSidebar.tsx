import {
  Box,
  Heading,
  Icon,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { BsFillArrowRightSquareFill, BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { Link as RouterLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AiOutlineClockCircle, AiOutlineSearch, AiOutlineComment } from 'react-icons/ai';
import { BiUpvote } from 'react-icons/bi';
import { GiPirateHat } from 'react-icons/gi';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';

const MainSidebar = () => {
  const [mainClass, setMainClass] = useState('main-sidebar-block');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { theme, handleIsSearchOpen } = useContext(GlobalContext) as IGlobalContext;
  const handleOpenMenu = () => {
    setIsMenuOpen((prevState) => !prevState);

    if (isMenuOpen) {
      setMainClass('main-sidebar-hover');
    } else {
      setMainClass('main-sidebar-block');
    }
  };

  return (
    <Box position="relative">
      <Icon
        onClick={handleOpenMenu}
        position="absolute"
        cursor="pointer"
        zIndex={4}
        left="15px"
        top="300px"
        as={isMenuOpen ? BsFillArrowRightSquareFill : BsFillArrowLeftSquareFill}
        fontSize="40px"
        color={theme === 'dark' ? '#FFF' : '#000'}
        borderRadius="8px"
        bg={theme === 'dark' ? '#000' : '#FFF'}
      />

      <Box
        className={mainClass}
        flexGrow="1"
        fontSize="1rem"
        textAlign="center"
        maxW="540px"
        color={theme === 'dark' ? '#fFF' : '#000'}
        bg={theme === 'dark' ? '#000' : '#fff'}
      >
        <Box color="purple.tertiary" p="0.5rem">
          <Heading mb="0.5rem" fontWeight="400" fontSize="16px" textAlign="left" as="h4">
            Explore
          </Heading>
          <UnorderedList
            display="flex"
            flexDir="column"
            alignItems="flex-start"
            listStyleType="none"
          >
            <ListItem layerStyle="listItemSidebar">
              <Icon mr="0.2rem" as={AiOutlineClockCircle} />
              <Link to="/posts/newest" as={RouterLink}>
                Newest
              </Link>
            </ListItem>
            <ListItem layerStyle="listItemSidebar" mb="0.2rem">
              <Icon mr="0.2rem" as={AiOutlineComment} />
              <Link to="/posts/discussed" as={RouterLink}>
                Most activity
              </Link>
            </ListItem>
            <ListItem layerStyle="listItemSidebar" mb="0.2rem">
              <Icon mr="0.2rem" as={BiUpvote} />
              <Link to="/posts/upvoted" as={RouterLink}>
                Most upvoted
              </Link>
            </ListItem>
            <ListItem layerStyle="listItemSidebar" mb="0.2rem">
              <Icon mr="0.2rem" as={GiPirateHat} />
              <Link to="devtrove-posts" as={RouterLink}>
                Devtrove posts
              </Link>
            </ListItem>

            <ListItem layerStyle="listItemSidebar" mb="0.2rem">
              <Icon mr="0.2rem" as={AiOutlineSearch} />
              <Text onClick={handleIsSearchOpen} role="button">
                Search
              </Text>
            </ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </Box>
  );
};

export default MainSidebar;
