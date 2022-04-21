import { Box, Heading, Icon, Link, ListItem, UnorderedList } from '@chakra-ui/react';
import { MdOutlineHistory } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import {
  BsBookmark,
  BsFillArrowRightSquareFill,
  BsFillArrowLeftSquareFill,
} from 'react-icons/bs';
import { useState } from 'react';
const SecondarySidebar = () => {
  const [mainClass, setMainClass] = useState('secondary-sidebar-block');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const handleOpenMenu = () => {
    setIsMenuOpen((prevState) => !prevState);

    if (isMenuOpen) {
      setMainClass('secondary-sidebar-hover');
    } else {
      setMainClass('secondary-sidebar-block');
    }
  };

  return (
    <Box position="relative">
      <Icon
        onClick={handleOpenMenu}
        position="absolute"
        right="15px"
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
        flexShrink="1"
        className={mainClass}
        textAlign="center"
        width="12rem"
        color="#FFF"
        fontSize="1rem"
      >
        <Box color="purple.tertiary" p="0.5rem">
          <Heading mb="0.5rem" fontWeight="400" fontSize="16px" textAlign="right" as="h4">
            Manage
          </Heading>
          <UnorderedList
            textAlign="right"
            display="flex"
            flexDir="column"
            listStyleType="none"
          >
            <ListItem layerStyle="listItemSidebar" textAlign="left" mb="0.2rem">
              <Icon mr="0.2rem" as={BsBookmark} />
              <Link to="/bookmarks" as={RouterLink}>
                Bookmarks
              </Link>
            </ListItem>

            <ListItem layerStyle="listItemSidebar" textAlign="left" mb="0.2rem">
              <Icon mr="0.2rem" as={MdOutlineHistory} />
              <Link to="/reading-history" as={RouterLink}>
                Reading history
              </Link>
            </ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </Box>
  );
};

export default SecondarySidebar;
