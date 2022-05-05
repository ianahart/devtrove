import { Box, Heading, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { GroupsContext } from '../../../context/groups';
import { IGroupsContext } from '../../../interfaces';
import Spinner from '../../Mixed/Spinner';
import InvitationItem from './InvitationItem';

const InvitationList = () => {
  const { invitationPag, invitations, pagInvitations, getInvitations } = useContext(
    GroupsContext
  ) as IGroupsContext;

  useEffect(() => {
    getInvitations();
  }, [getInvitations]);

  return (
    <Box p="0.25rem">
      <Heading textAlign="center" fontSize="16px">
        Invitations
      </Heading>
      {invitations.length > 0 && (
        <Box overflowY="auto" width="100%" height="300px" className="search-dropdown">
          {invitations.map((invitation) => {
            return <InvitationItem key={invitation.pk} invitation={invitation} />;
          })}
          {invitationPag.has_next && (
            <Box
              onClick={pagInvitations}
              cursor="pointer"
              role="button"
              textAlign="center"
            >
              <Text color="purple.secondary" fontWeight="bold">
                More invitations...
              </Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default InvitationList;
