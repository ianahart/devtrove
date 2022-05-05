import { Box, Button, Text, Heading } from '@chakra-ui/react';
import { useEffect, useContext, useState, useCallback } from 'react';
import { IGroupsContext } from '../../interfaces';
import { GroupsContext } from '../../context/groups';
import Spinner from '../Mixed/Spinner';
import GroupItem from './GroupItem';

const GroupList = () => {
  const [isLoaded, setIsLoaded] = useState(true);
  const { groups, groupPag, pagGroups, getGroups } = useContext(
    GroupsContext
  ) as IGroupsContext;

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  return (
    <Box p="0.25rem">
      <Heading textAlign="center" fontSize="16px">
        Group List
      </Heading>
      <Box>
        <Box overflowY="auto" width="100%" height="300px" className="search-dropdown">
          <Box display="flex" justifyContent="center" flexDir="column">
            {groups.map((group) => {
              return <GroupItem key={group.id} group={group} />;
            })}
          </Box>
          {groupPag.has_next && (
            <Box display="flex" alignItems="center" justifyContent="center" m="auto">
              <Button
                color="purple.secondary"
                bg="transparent"
                _active={{ background: 'transparent' }}
                _hover={{ background: 'transparent' }}
                onClick={pagGroups}
              >
                More groups...
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GroupList;
