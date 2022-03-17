import { Box, Button, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../Mixed/Logo';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import { useContext } from 'react';

const Navigation = () => {
  const { openModal } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box
      color="#FFF"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="#444447"
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
        <Button onClick={openModal} color="text.secondary" bg="light.primary">
          Come aboard
        </Button>
      </Box>
    </Box>
  );
};

export default Navigation;
