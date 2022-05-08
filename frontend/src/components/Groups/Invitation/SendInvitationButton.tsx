import {
  Box,
  Button,
  Heading,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import axios, { AxiosError } from 'axios';
import { GlobalContext } from '../../../context/global';
import { IGlobalContext, IGroup } from '../../../interfaces';
import FormInput from '../../Forms/FormInput';
import { http } from '../../../helpers';

export interface ISendInvitationButtonProps {
  group: IGroup;
}

const SendInvitationButton = ({ group }: ISendInvitationButtonProps) => {
  const toast = useToast();
  const initialHandleState = { name: 'handle', value: '', error: '' };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const [handle, setHandle] = useState(initialHandleState);
  const [error, setError] = useState('');

  const captureInput = (name: string, value: string) => {
    setHandle((prevState) => ({
      ...prevState,
      name,
      value,
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setHandle(initialHandleState);
  };

  const handleOnClickSend = async () => {
    try {
      setError('');
      if (handle.value.trim().length === 0 || handle.value.trim().length > 100) {
        setError('Handle must be between 1 and 100 characters.');
        return;
      }
      const response = await http.post('/invitations/', {
        host: group.host,
        group: group.id,
        handle: handle.value,
        group_id: group.group_id,
      });
      closeModal();

      toast({
        title: 'Invitation Sent.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          setError(e.response?.data.error.handle);
          return;
        }
        setError(e.response?.data.error);
      }
    }
  };

  return (
    <>
      <Box
        onClick={() => setIsModalOpen(true)}
        mt="0.5rem"
        ml="0.5rem"
        display="flex"
        alignItems="center"
        role="button"
      >
        <Icon
          mr="0.5rem"
          color={theme === 'dark' ? '#FFF' : '#000'}
          fontSize="16px"
          as={AiOutlineMail}
        />
        <Text fontSize="0.9rem">Send Invite</Text>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay bg="rgba(225,225,225, 0.5)" />
          <ModalContent bg={theme === 'dark' ? '#000' : '#FFF'} minHeight="500px">
            <ModalCloseButton
              _focus={{ outline: 'none' }}
              fontSize="22px"
              color={theme === 'dark' ? '#FFF' : '#000'}
            />
            <ModalBody width="95%" margin="0 auto" p="0.5rem">
              <Box m="7rem auto 1.5rem auto">
                <Heading
                  textAlign="center"
                  fontSize="20px"
                  color={theme === 'dark' ? '#FFF' : '#000'}
                >
                  Send out an invitation
                </Heading>
                <Box mt="5rem">
                  <Text
                    mb="0.5rem"
                    fontSize="0.9rem"
                    color="purple.secondary"
                    textAlign="center"
                  >
                    {error}
                  </Text>
                  <FormInput
                    id="handle"
                    type="text"
                    active={true}
                    value={handle.value}
                    captureInput={captureInput}
                    error={handle.error}
                    label="User Handle:"
                    name="handle"
                  />
                </Box>
                <Box mt="4rem" display="flex" justifyContent="space-evenly">
                  <Button mx="0.25rem" variant="entryButton" onClick={handleOnClickSend}>
                    Send
                  </Button>
                  <Button mx="0.25rem" onClick={closeModal} variant="secondaryButton">
                    Cancel
                  </Button>
                </Box>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default SendInvitationButton;
