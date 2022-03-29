import { Box, Icon, UnorderedList } from '@chakra-ui/react';
import { useContext, useRef, useEffect, useCallback } from 'react';
import { AiOutlineSetting, AiOutlineClose } from 'react-icons/ai';
import { GiPirateCaptain } from 'react-icons/gi';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import UserMenuItem from './UserMenuItem';
import Logout from '../Auth/Logout';
const UserMenu = () => {
  const { userAuth, closeUserMenu } = useContext(GlobalContext) as IGlobalContext;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLButtonElement;
      if (menuRef.current !== null) {
        const children = Array.from(menuRef.current.children);
        if (!children?.includes(target)) {
          closeUserMenu();
        }
      }
    },
    [closeUserMenu]
  );

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);

  return (
    <Box
      ref={menuRef}
      p="0.25rem"
      position="absolute"
      top={[0, '70px', '70px']}
      right={[0, '35px', '35px']}
      height={['100vh', '120px', '120px']}
      width={['100vw', '120px', '120px']}
      bg="dark.secondary"
      borderRadius="8px"
      boxShadow="md"
    >
      <Icon
        onClick={closeUserMenu}
        height="40px"
        width="40px"
        p="0.25rem"
        ml="auto"
        display={['flex', 'none', 'none']}
        as={AiOutlineClose}
      />
      <UnorderedList
        display="flex"
        flexDir="column"
        alignItems={['center', 'flex-start', 'flex-start']}
        listStyleType="none"
        p="0"
      >
        <UserMenuItem
          to={`/${userAuth.user.handle}/profile`}
          icon={GiPirateCaptain}
          linkText="Profile"
        />
        <UserMenuItem
          to={`/${userAuth.user.handle}/account`}
          icon={AiOutlineSetting}
          linkText="Account"
        />
        <Logout />
      </UnorderedList>
    </Box>
  );
};

export default UserMenu;
