import { Box, Image } from '@chakra-ui/react';
import notFound from '../images/ErrorPage404-04.jpg';
const PageNotFound = () => {
  return (
    <Box>
      <Image src={notFound} height="100%" minH="100vh" width="100%" />
    </Box>
  );
};

export default PageNotFound;
