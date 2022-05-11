import { Box, Link, Text, Tooltip } from '@chakra-ui/react';
import { useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { GlobalContext } from '../../../context/global';
import { IGlobalContext, IGroup } from '../../../interfaces';
import Logo from '../../Mixed/Logo';
import SendInvitationButton from '../Invitation/SendInvitationButton';
export interface IGroupItemProps {
  group: IGroup;
  webSocket: WebSocket | null;
}

const GroupItem = ({ group, webSocket }: IGroupItemProps): JSX.Element => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const params = useParams();
  return (
    <>
      <Box cursor="pointer" p="0.4rem" my="0.5rem" display="flex">
        <Link as={RouterLink} to={`/${params.handle}/groups/users/${group.group_id}`}>
          <Box>
            <Tooltip
              label={group.host === group.group_user ? 'Host' : 'Member'}
              placement="right-end"
            >
              <Box flexWrap="wrap" display="flex" alignItems="center">
                <Box borderRadius="50%" boxShadow="md" bg={group.avatar}>
                  <Logo
                    textOne=""
                    textTwo=""
                    width="30px"
                    height="30px"
                    fontSize="12px"
                  />
                </Box>
                <Text
                  fontSize="0.9rem"
                  ml="1rem"
                  color={theme === 'dark' ? '#FFF' : '#000'}
                >
                  {group.title}
                </Text>
              </Box>
            </Tooltip>
            {group.host === group.group_user && (
              <SendInvitationButton webSocket={webSocket} group={group} />
            )}
          </Box>
        </Link>
      </Box>
    </>
  );
};

export default GroupItem;
