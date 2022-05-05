import { Box, Button, Icon } from '@chakra-ui/react';
import { useContext } from 'react';
import { MdGroups } from 'react-icons/md';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import BasicModal from '../Mixed/BasicModal';
import CreateGroup from './Group/CreateGroup';
import GroupList from './Group/GroupList';
import InvitationList from './Invitation/InvitationList';

const Sidebar = () => {
  const { openModal } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box color="text.primary" className="group-sidebar">
      <Box p="0.25rem" mt="3rem">
        <Box display="flex" justifyContent="center">
          <Button
            onClick={() => openModal()}
            border="none"
            display="flex"
            alignItems="center"
            bg="transparent"
            _active={{ background: 'none' }}
            _hover={{ background: 'transparent' }}
          >
            <Icon mr="0.5rem" as={MdGroups} />
            Create group
          </Button>
        </Box>
        <BasicModal>
          <CreateGroup />
        </BasicModal>
        <Box mt="5rem">
          <GroupList />
        </Box>
        <Box mt="2rem">
          <InvitationList />
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
