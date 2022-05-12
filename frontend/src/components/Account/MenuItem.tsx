import { Box, Icon, ListItem, Link } from '@chakra-ui/react';
import { useContext } from 'react';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import { Link as RouterLink } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { IAccountInnerMenuItemProps } from '../../interfaces/props';

const MenuItem = ({
  menu = 'parent',
  handleSetActiveTab,
  activeTab,
  linkText,
  to,
  icon,
}: IAccountInnerMenuItemProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const color = activeTab === to ? (theme === 'dark' ? '#FFF' : '#000') : '#8a8f9d';

  return (
    <ListItem
      _hover={{ backgroundColor: '#363636' }}
      onClick={() => handleSetActiveTab(to)}
      py="0.5rem"
    >
      <Box display="flex" px="0.25rem" justifyContent="space-between">
        <Icon mr="0.25rem" height="26px" width="26px" as={icon} color={color} />
        <Box flexGrow="3" display="flex" flexDir="column">
          <Link as={RouterLink} color={color} to={to}>
            {linkText}
          </Link>
          {menu === 'child' && (
            <Box width="100%" height="1px" mt="0.25rem" bg="#444447"></Box>
          )}
        </Box>
        {activeTab === to && (
          <Icon height="34px" ml="auto" width="34px" as={FiChevronRight} color={color} />
        )}
      </Box>
    </ListItem>
  );
};

export default MenuItem;
