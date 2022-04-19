import { Box, Heading, Icon, Link, ListItem, UnorderedList } from '@chakra-ui/react';
import { BsFillArrowRightSquareFill, BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import {
  AiOutlineClockCircle,
  AiOutlineFire,
  AiOutlineSearch,
  AiOutlineComment,
} from 'react-icons/ai';
import { BiUpvote } from 'react-icons/bi';

const MainSidebar = () => {
  const [mainClass, setMainClass] = useState('main-sidebar-block');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        top="300px"
        as={isMenuOpen ? BsFillArrowRightSquareFill : BsFillArrowLeftSquareFill}
        fontSize="40px"
        color="#FFF"
        borderRadius="8px"
        bg="#000"
      />

      <Box
        className={mainClass}
        flexGrow="1"
        fontSize="1rem"
        textAlign="center"
        maxW="540px"
        color="#fff"
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
              <Link to="posts/newest" as={RouterLink}>
                Newest
              </Link>
            </ListItem>
            <ListItem layerStyle="listItemSidebar">
              <Icon mr="0.2rem" as={AiOutlineFire} />
              <Link to="posts/popular" as={RouterLink}>
                Popular
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
              <Icon mr="0.2rem" as={AiOutlineSearch} />
              <Link to="/posts/search" as={RouterLink}>
                Search
              </Link>
            </ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </Box>
  );
};

export default MainSidebar;
