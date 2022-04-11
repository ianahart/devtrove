import { Box, Spinner as Loader, Text } from '@chakra-ui/react';

interface ISpinner {
  text?: string;
}
const Spinner = ({ text }: ISpinner) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      flexDir="column"
      bg="rgba(244, 241, 242, 0.31)"
    >
      <Loader
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text mt="1rem" color="purple.primary">
        {text}
      </Text>
    </Box>
  );
};

export default Spinner;
