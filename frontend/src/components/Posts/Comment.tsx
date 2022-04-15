import {
  Box,
  Icon,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { GiSwordBrandish } from 'react-icons/gi';
import { BsFlagFill, BsTrash, BsThreeDotsVertical } from 'react-icons/bs';
import axios, { AxiosError } from 'axios';
import { IComment } from '../../interfaces';
import { http } from '../../helpers';
import ProfilePicture from '../Account/ProfilePicture';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
import CommentCodeBlock from './CommentCodeBlock';
import { FiEdit3 } from 'react-icons/fi';
interface ISingleCommentProps {
  comment: IComment;
  handleCommentOperation: () => void;
  syncEdit: (id: number) => void;
}

const Comment = ({ comment, handleCommentOperation, syncEdit }: ISingleCommentProps) => {
  const [error, setError] = useState('');
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const handleOnClick = () => {
    console.log(` Comment.tsx | upvoting comment ${comment.id}`);
  };
  const deleteComment = async () => {
    try {
      const response = await http.delete(`/comments/${comment.id}/`);
      if (response.status === 200) {
        handleCommentOperation();
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data);
      }
    }
  };

  const handleEditComment = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    syncEdit(comment.id);
  };

  const commentActions = () => {
    if (!userAuth.user.logged_in) {
      return <Box></Box>;
    } else if (userAuth.user.logged_in && userAuth.user.id === comment.user.id) {
      return (
        <Box onClick={deleteComment} cursor="pointer">
          <MenuItem _hover={{ background: '#313135' }}>
            <Icon as={BsTrash} color="purple.secondary" fontSize="0.9rem" mr="0.4rem" />{' '}
            <Text>Remove</Text>
          </MenuItem>

          <MenuItem onClick={handleEditComment} _hover={{ background: '#313135' }}>
            <Icon as={FiEdit3} color="purple.secondary" fontSize="0.9rem" mr="0.4rem" />{' '}
            <Text>Edit</Text>
          </MenuItem>
        </Box>
      );
    }
    return (
      <MenuItem _hover={{ background: '#313135' }}>
        <Icon as={BsFlagFill} color="purple.secondary" fontSize="0.9rem" mr="0.4rem" />
        <Text> Flag</Text>
      </MenuItem>
    );
  };

  return (
    <Box my="1.5rem" padding="0.5rem" color="#FFF">
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" justifyContent="flex-start">
          <Box>
            <ProfilePicture
              avatar_url={comment.user.avatar_url}
              height="40px"
              width="40px"
            />
          </Box>
          <Box ml="0.5rem">
            <Text fontWeight="bold">
              {comment.user.handle ? comment.user.handle : 'No Name'}
            </Text>
            <Text>{comment.readable_date}</Text>
            {comment.edited && (
              <Text textAlign="left" color="text.primary">
                (edited)
              </Text>
            )}
          </Box>
        </Box>
        {userAuth.user.logged_in && (
          <Menu size="100px">
            <MenuButton
              as={IconButton}
              color="text.primary"
              fontSize="25px"
              _hover={{ background: 'transparent' }}
              _active={{ background: 'transparent' }}
              background="transparent"
              border="none"
              aria-label="Options"
              icon={<BsThreeDotsVertical />}
              variant="outline"
            />
            <MenuList
              width="100px"
              color="purple.secondary"
              boxShadow="lg"
              border="1px solid"
              borderColor="text.secondary"
              bg="#353440"
            >
              {commentActions()}
            </MenuList>
          </Menu>
        )}
      </Box>
      <Box textAlign="left">
        {comment.code_snippet && (
          <CommentCodeBlock language={comment.language} code={comment.code_snippet} />
        )}
        {comment.text && (
          <Box bg="#2a2c2a" my="0.5rem" borderRadius="20px" boxShadow="lg" padding="1rem">
            {comment.text}
          </Box>
        )}
        <Box cursor="pointer" onClick={handleOnClick} my="1rem">
          <Icon ml="1rem" as={GiSwordBrandish} color="text.primary" fontSize="25px" />
          <Text fontWeight="bold" mt="-0.3rem" ml="1rem" color="text.primary">
            1
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Comment;
