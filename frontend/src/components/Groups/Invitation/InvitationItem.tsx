import { Box, Button, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { GlobalContext } from '../../../context/global';
import { GroupsContext } from '../../../context/groups';
import { IGlobalContext, IInvitation, IGroupsContext } from '../../../interfaces';
import ProfilePicture from '../../Account/ProfilePicture';
interface IInvitationItemProps {
  invitation: IInvitation;
}

const InvitationItem = ({ invitation }: IInvitationItemProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const { acceptInvitation, denyInvitation } = useContext(
    GroupsContext
  ) as IGroupsContext;
  return (
    <Box mx="0.25rem" p="0.4rem" mb="0.5rem" mt="0.5rem">
      <Box display="flex" alignItems="center">
        <Box>
          <ProfilePicture
            borderRadius="50%"
            avatar_url={invitation.avatar_url}
            width="40px"
            height="40px"
          />
        </Box>
        <Box ml="0.25rem">
          <Text color={theme === 'dark' ? '#FFF' : '#000'}>{invitation.handle}</Text>
        </Box>
      </Box>
      <Box textAlign="center" my="0.25rem">
        <Text color={theme === 'dark' ? '#FFF' : '#000'}>{invitation.title}</Text>
      </Box>
      <Box my="0.25rem" justifyContent="space-evenly" display="flex">
        <Button
          onClick={() =>
            acceptInvitation(invitation.group, invitation.user, invitation.pk)
          }
          variant="transparentButton"
        >
          Join
        </Button>
        <Button onClick={() => denyInvitation(invitation.pk)} variant="transparentButton">
          Deny
        </Button>
      </Box>
    </Box>
  );
};

export default InvitationItem;
