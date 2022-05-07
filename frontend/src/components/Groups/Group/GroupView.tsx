import { Box, Text } from '@chakra-ui/react';
import GroupViewContents from './GroupViewContents';

const GroupView = () => {
  return (
    <Box
      className="group-view"
      border="1px solid blue"
      margin="8rem auto 1rem auto"
      p="0.5rem"
      minH="400px"
    >
      <GroupViewContents />
      <Text color="#FFF">GROUP VIEW</Text>
    </Box>
  );
};

export default GroupView;
