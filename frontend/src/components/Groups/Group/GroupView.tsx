import { Box, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { IGroupsContext } from '../../../interfaces';
import { GroupsContext } from '../../../context/groups';
import GroupViewContents from './GroupViewContents';

const GroupView = () => {
  const { groupError } = useContext(GroupsContext) as IGroupsContext;
  return (
    <Box className="group-view" margin="8rem auto 1rem auto">
      {groupError && (
        <Box display="flex" mb="4rem" justifyContent="center">
          <Text color="purple.secondary">{groupError}</Text>
        </Box>
      )}
      <GroupViewContents />
    </Box>
  );
};

export default GroupView;
