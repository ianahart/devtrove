import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { IBasicModalProps } from '../../interfaces/props';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';

const BasicModal: React.FC<IBasicModalProps> = ({
  children,
  resetForm,
}: IBasicModalProps): JSX.Element => {
  const { userAuth, closeModal, isModalOpen } = useContext(
    GlobalContext
  ) as IGlobalContext;
  const navigate = useNavigate();

  const handleOnClose = () => {
    if (resetForm) {
      resetForm();
    }
    closeModal();
    if (!userAuth.user.logged_in) {
      navigate('/');
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} isCentered onClose={handleOnClose}>
        <ModalOverlay bg="rgba(225,225,225, 0.5)" />
        <ModalContent bg="black.primary" minHeight="500px">
          <ModalCloseButton _focus={{ outline: 'none' }} fontSize="22px" color="#FFF" />
          <ModalBody width="95%" margin="0 auto" p="0.5rem">
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BasicModal;
