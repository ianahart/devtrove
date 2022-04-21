import { Box, Icon, Link, Text } from '@chakra-ui/react';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { Link as RouterLink } from 'react-router-dom';

const GoBack = () => {
  return (
    <Link as={RouterLink} to="/">
      <Box display="flex" m="1rem" alignItems="center">
        <Icon color="#FFF" as={HiChevronDoubleLeft} />
        <Text color="#FFF">Go back</Text>
      </Box>
    </Link>
  );
};

export default GoBack;
