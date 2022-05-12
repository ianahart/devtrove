import { IGlobalContext, IMessage } from '../../../interfaces';
import { Box, Text } from '@chakra-ui/react';
import ProfilePicture from '../../Account/ProfilePicture';
import { useContext } from 'react';
import { GlobalContext } from '../../../context/global';

export interface IMessageProps {
  message: IMessage;
}

const Message = ({ message }: IMessageProps) => {
  const { theme, userAuth } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box my="2.5rem" color={theme === 'dark' ? '#FFF' : '#000'}>
      <Box display="flex" alignItems="center">
        <ProfilePicture
          borderRadius="50%"
          avatar_url={message.avatar_url}
          width="40px"
          height="40px"
        />
        <Text
          color={userAuth.user.id === message.user ? 'purple.secondary' : '#FFF'}
          fontSize="0.9rem"
          fontWeight="bold"
          ml="1.2rem"
        >
          {message.handle}
        </Text>
      </Box>
      <Box mt="0.5rem">
        <Text color="text.primary" fontSize="0.8rem">
          {message.readable_date}
        </Text>
      </Box>
      <Box
        mt="0.5rem"
        p="1rem 2rem"
        boxShadow="md"
        bg="purple.secondary"
        borderRadius="20px"
      >
        {message.message}
      </Box>
    </Box>
  );
};
export default Message;
