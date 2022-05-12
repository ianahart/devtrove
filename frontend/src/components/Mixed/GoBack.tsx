import { Box, Icon, Link, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { Link as RouterLink } from 'react-router-dom';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
const GoBack = () => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Link as={RouterLink} to="/">
      <Box
        color={theme === 'dark' ? '#FFF' : '#000'}
        display="flex"
        m="1rem"
        alignItems="center"
      >
        <Icon as={HiChevronDoubleLeft} />
        <Text>Go back</Text>
      </Box>
    </Link>
  );
};

export default GoBack;
