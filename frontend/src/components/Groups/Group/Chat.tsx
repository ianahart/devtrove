import { Box, Button, Text, Textarea } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { nanoid } from 'nanoid';
import { GlobalContext } from '../../../context/global';
import { IMessage, IGlobalContext, IGroupData } from '../../../interfaces';
import { IMessagesRequest } from '../../../interfaces/requests';
import { getGroupId, http, getStorage } from '../../../helpers';
import Message from '../Messages/Message';
export interface IChatProps {
  group: IGroupData;
}

const Chat = ({ group }: IChatProps) => {
  const webSocket = useRef<WebSocket | null>(null);
  const { theme, userAuth } = useContext(GlobalContext) as IGlobalContext;
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ has_next: false, page: 1 });
  const initialTextarea = { name: 'message', value: '', error: '' };
  const [textarea, setTextarea] = useState(initialTextarea);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea((prevState) => ({ ...prevState, value: e.target.value }));
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && validated()) {
      send();
    }
  };

  useEffect(() => {
    webSocket.current = new WebSocket(
      `ws://orca-app-3lkiz.ondigitalocean.app:8080/ws/chat/${getGroupId()}/?token=${
        getStorage().access_token
      }`
    );
    webSocket.current.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      if (data.message.action === 'online_users') {
        setOnlineUsers(data.message.online_users);
      } else if (data.message.action === 'message') {
        setMessages((prevState) => [data.message, ...prevState]);
      }
    };
    return () => webSocket?.current?.close();
  }, []);

  const send = () => {
    webSocket?.current?.send(
      JSON.stringify({
        message: textarea.value,
        group_id: group.group_id,
        user_id: group.user_id,
        token: userAuth.access_token,
        action: 'message',
      })
    );
    clear();
  };

  const clear = () => setTextarea(initialTextarea);

  const validated = () => {
    return textarea.value.trim().length === 0 ? false : true;
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validated()) {
      return;
    }
    send();
  };

  const paginate = async () => {
    try {
      if (!pagination.has_next) {
        return;
      }
      const response = await http.get<IMessagesRequest>(
        `/messages/?group=${group.id}&page=${pagination.page}`
      );
      setMessages((prevState) => [...prevState, ...response.data.messages]);
      setPagination((prevState) => ({ ...prevState, ...response.data.pagination }));
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        setError(e.response?.data.error);
      }
    }
  };

  const fetchMessages = useCallback(async () => {
    try {
      const response = await http.get<IMessagesRequest>(
        `/messages/?group=${group.id}&page=0`
      );
      setMessages(response.data.messages);
      setPagination((prevState) => ({ ...prevState, ...response.data.pagination }));
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        setError(e.response?.data.error);
      }
    }
  }, [group.id]);

  useEffect(() => {
    setOnlineUsers([]);
    fetchMessages();
  }, [fetchMessages]);

  return (
    <Box minH="400px" mt="5rem">
      <Box
        className="overflow-scroll"
        display="flex"
        flexDir="column"
        overflowY="auto"
        height="150px"
        width="200px"
        color={theme === 'dark' ? '#FFF' : '#000'}
        bg="black.primary"
        borderRadius="12px"
        p="0.25rem"
      >
        <Text color="text.primary">Online Users({onlineUsers.length})</Text>
        {onlineUsers.map((user) => {
          return (
            <Box
              p="0.5rem"
              display="flex"
              flexDir="column"
              position="relative"
              key={nanoid()}
            >
              <Text>{user}</Text>
              <Box
                borderRadius="50%"
                top="10px"
                left="0"
                bg="lime"
                height="8px"
                width="8px"
                position="absolute"
              ></Box>
            </Box>
          );
        })}
      </Box>
      <Box
        margin="0 auto"
        cursor="pointer"
        display="flex"
        maxHeight="400px"
        width="100%"
        maxWidth="760px"
        flexDir="column-reverse"
        overflowY="auto"
        color="#FFF"
        p="0.5rem"
        className="overflow-scroll"
      >
        {messages.map((message) => {
          return <Message key={nanoid()} message={message} />;
        })}
        {pagination.has_next && (
          <Box
            onClick={paginate}
            display="flex"
            justifyContent="center"
            role="button"
            color="purple.secondary"
            fontWeight="bold"
            fontSize="0.9rem"
          >
            Previous Messages...
          </Box>
        )}
      </Box>
      <Box mt="2rem">
        <form onSubmit={handleOnSubmit}>
          <Textarea
            onKeyDown={handleOnKeyDown}
            onChange={handleOnChange}
            resize="none"
            bg="black.primary"
            placeholder="Send a message..."
            border="none"
            _focus={{ outline: 'none' }}
            value={textarea.value}
          ></Textarea>
          <Box display="flex" mr="0.5rem" justifyContent="flex-end" mt="0.5rem">
            <Button
              bg="purple.secondary"
              _hover={{ background: 'purple.secondary' }}
              color="#FFF"
              ml="0.5rem"
              mt="0.5rem"
              type="submit"
            >
              Send
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
export default Chat;
