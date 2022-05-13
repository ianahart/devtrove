import { Box, Button, Heading } from '@chakra-ui/react';
import { useEffect, useContext, useRef, useState } from 'react';
import { IGlobalContext, IGroupsContext } from '../../../interfaces';
import { GroupsContext } from '../../../context/groups';
import Spinner from '../../Mixed/Spinner';
import GroupItem from './GroupItem';
import { GlobalContext } from '../../../context/global';

const GroupList = () => {
  const webSocket = useRef<WebSocket | null>(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const { groups, groupPag, addInvitation, pagGroups, getGroups } = useContext(
    GroupsContext
  ) as IGroupsContext;

  useEffect(() => {
    webSocket.current = new WebSocket(
      `ws://orca-app-3lkiz.ondigitalocean.app/ws/invitation/${userAuth.user.id}/?token=${userAuth.access_token}`
    );

    webSocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addInvitation(data.message);
    };
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    getGroups();
    setIsLoaded(true);
  }, [getGroups, userAuth.user.id, userAuth.access_token]);

  return (
    <Box p="0.25rem">
      <Heading textAlign="center" fontSize="16px">
        Groups
      </Heading>
      {!isLoaded ? (
        <Spinner text="Loading groups..." />
      ) : (
        <Box>
          <Box overflowY="auto" width="100%" height="300px" className="search-dropdown">
            <Box display="flex" justifyContent="center" flexDir="column">
              {groups.map((group) => {
                return (
                  <GroupItem webSocket={webSocket.current} key={group.id} group={group} />
                );
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
      )}
    </Box>
  );
};

export default GroupList;
