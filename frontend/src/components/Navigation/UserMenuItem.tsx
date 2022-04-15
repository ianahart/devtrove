import { Icon, ListItem, Link } from '@chakra-ui/react';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IMenuItemProps } from '../../interfaces/props';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
const UserMenuItem = ({ linkText, to, icon }: IMenuItemProps) => {
  const { closeUserMenu } = useContext(GlobalContext) as IGlobalContext;
  return (
    <ListItem py={['0.5rem', '0.25rem']} textAlign="left" color="text.primary">
      <Link
        fontSize={['1.5rem', '1rem']}
        onClick={closeUserMenu}
        _hover={{ color: '#707071' }}
        as={RouterLink}
        to={to}
      >
        <Icon mr="0.25rem" as={icon} />
        {linkText}
      </Link>
    </ListItem>
  );
};

export default UserMenuItem;
