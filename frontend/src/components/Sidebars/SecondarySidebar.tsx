import { Box, Heading, Icon, Link, ListItem, UnorderedList } from '@chakra-ui/react';
import { MdOutlineHistory } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import {
  BsBookmark,
  BsPencil,
  BsFillArrowRightSquareFill,
  BsFillArrowLeftSquareFill,
  BsJournalMedical,
} from 'react-icons/bs';
import { useContext, useState } from 'react';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';

const SecondarySidebar = () => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
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
        color={theme === 'dark' ? '#FFF' : '#000'}
        borderRadius="8px"
        bg={theme === 'dark' ? '#000' : '#FFF'}
      />

      <Box
        flexShrink="1"
        className={mainClass}
        textAlign="center"
        width="12rem"
        color={theme === 'dark' ? '#fFF' : '#000'}
        bg={theme === 'dark' ? '#000' : '#FFF'}
        fontSize="1rem"
      >
        <Box bg={theme === 'dark' ? '#000' : '#fFF'} color="purple.tertiary" p="0.5rem">
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

            <ListItem layerStyle="listItemSidebar" textAlign="left" mb="2rem">
              <Icon mr="0.2rem" as={MdOutlineHistory} />
              <Link to="/reading-history" as={RouterLink}>
                Reading history
              </Link>
            </ListItem>
            <ListItem layerStyle="listItemSidebar" textAlign="left" mb="0.2rem">
              <Icon mr="0.2rem" as={BsPencil} />
              <Link to="/editor" as={RouterLink}>
                Write post
              </Link>
            </ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </Box>
  );
};

export default SecondarySidebar;
