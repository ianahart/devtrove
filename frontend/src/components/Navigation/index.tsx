import { Box, Button, Icon, Link } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import Logo from '../Mixed/Logo';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import UserMenu from './UserMenu';

const Navigation = () => {
  const { isUserMenuShowing, toggleUserMenu, userAuth, openModal } = useContext(
    GlobalContext
  ) as IGlobalContext;

  const canShowUserMenu = userAuth.user.logged_in && isUserMenuShowing;

  return (
    <Box
      color="#FFF"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="#444447"
      position="relative"
    >
      <Box
        p="0.25rem 0.75rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Link as={RouterLink} to="/">
          <Logo
            fontSize="28px"
            textOne="Dev"
            textTwo="Trove"
            height="60px"
            width="60px"
          />
        </Link>
        {userAuth.user.logged_in ? (
          <Icon
            onClick={toggleUserMenu}
            cursor="pointer"
            as={FaUserCircle}
            height="40px"
            width="40px"
          />
        ) : (
          <Button onClick={openModal} color="text.secondary" bg="light.primary">
            Come aboard
          </Button>
        )}
      </Box>
      {canShowUserMenu && <UserMenu />}
    </Box>
  );
};

export default Navigation;
