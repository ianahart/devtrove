import {
  Box,
  Icon,
  IconButton,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { GiSwordBrandish } from 'react-icons/gi';
import { BsFlagFill, BsTrash, BsThreeDotsVertical } from 'react-icons/bs';
import axios, { AxiosError } from 'axios';
import { http } from '../../helpers';
import ProfilePicture from '../Account/ProfilePicture';
import { IGlobalContext } from '../../interfaces';
import { ISingleCommentProps } from '../../interfaces/props';
import { GlobalContext } from '../../context/global';
import CommentCodeBlock from './CommentCodeBlock';
import { FiEdit3 } from 'react-icons/fi';

const Comment = ({
  comment,
  likeComment,
  unlikeComment,
  handleCommentOperation,
  syncEdit,
}: ISingleCommentProps) => {
  const [error, setError] = useState('');
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
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
          <MenuItem
            _focus={{ background: 'transparent' }}
            _hover={{ background: '#313135' }}
          >
            <Icon as={BsTrash} color="purple.secondary" fontSize="0.9rem" mr="0.4rem" />{' '}
            <Text>Remove</Text>
          </MenuItem>

          <MenuItem
            onClick={handleEditComment}
            _focus={{ background: 'transparent' }}
            _hover={{ background: '#313135' }}
          >
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

  const handleLike = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (comment.cur_user_liked) {
      unlikeComment(comment.id);
      return;
    } else {
      if (userAuth.user.id) {
        likeComment({
          user: userAuth.user.id,
          comment: comment.id,
          post: comment.post_id,
        });
      }
    }
  };

  return (
    <Box my="1.5rem" padding="0.5rem" color="#FFF">
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" justifyContent="flex-start">
          <Box>
            <ProfilePicture
              borderRadius="50%"
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
        <Tooltip placement="top-end" label="React to comment" aria-label="a tooltip">
          <Box width="100px" onClick={handleLike} cursor="pointer" my="1rem">
            <Box as="span">
              <Icon
                borderRadius="50%"
                padding="0.3rem"
                backgroundColor={`${
                  comment.cur_user_liked ? 'rgba(25, 135, 84, 0.5)' : 'transparent'
                }`}
                ml="1rem"
                as={GiSwordBrandish}
                color="text.primary"
                fontSize="30px"
              />
            </Box>
            <Text fontWeight="bold" mt="-0.3rem" ml="1.7rem" color="text.primary">
              {comment.likes_count > 0 ? comment.likes_count : ''}
            </Text>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Comment;
