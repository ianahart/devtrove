import { Box, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';

const Options = () => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box className="group-sidebar">
      <Text color="#FFF" textAlign="center">
        {' '}
        Options sidebar
      </Text>
    </Box>
  );
};

export default Options;
