import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { IBasicModalProps } from '../../interfaces';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';

const BasicModal: React.FC<IBasicModalProps> = ({
  children,
  resetForm,
}: IBasicModalProps): JSX.Element => {
  const { closeModal, isModalOpen } = useContext(GlobalContext) as IGlobalContext;

  const handleOnClose = () => {
    if (resetForm) {
      resetForm();
    }
    closeModal();
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
