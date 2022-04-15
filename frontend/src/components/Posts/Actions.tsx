import { Box, Link } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { BiUpvote } from 'react-icons/bi';
import { ImBubble2 } from 'react-icons/im';
import { BsFillBookmarkStarFill } from 'react-icons/bs';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Action from './Action';
import { http } from '../../helpers';
import { IActionsProps } from '../../interfaces/props';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';

const Actions = ({
  id,
  cur_user_voted,
  upvotes_count,
  updatePostUpvote,
  slug,
  comments_count,
}: IActionsProps) => {
  const navigate = useNavigate();
  const { openModal, userAuth } = useContext(GlobalContext) as IGlobalContext;
  const [error, setError] = useState('');
  const location = useLocation();

  const handleVote = async () => {
    if (!userAuth.user.logged_in) {
      return;
    }

    if (cur_user_voted) {
      await downVote();
      if (updatePostUpvote) {
        updatePostUpvote(id, 'downvote');
      }
      return;
    } else {
      await upVote();
      if (updatePostUpvote) {
        updatePostUpvote(id, 'upvote');
      }
    }
  };

  const downVote = async () => {
    try {
      const response = await http.delete(`upvotes/${id}/`);
      if (response.status === 201) {
        console.log(response);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e) && e.response) {
        setError(e.response?.data?.error);
      }
    }
  };

  const upVote = async () => {
    try {
      const response = await http.post('/upvotes/', {
        user: userAuth.user.id,
        post: id,
        type: 'post',
      });
      if (response.status === 201) {
        console.log(response);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e) && e.response) {
        setError(e.response?.data?.error);
      }
    }
  };

  const toggleBookmark = () => {
    if (!userAuth.user.logged_in) {
      return;
    }

    console.log(`Toggling bookmark of post: ${id}`);
  };

  const handleOnClick = () => {
    openModal();

    if (!userAuth.user.logged_in) {
      navigate('/login');
    }
  };

  return (
    <Box
      flexDir="column"
      pb="0.6rem"
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      my="0.25rem"
    >
      <Box width="100%" display="flex" justifyContent="space-between" p="0.25rem">
        <Box
          borderRadius="50%"
          height="30px"
          width="30px"
          backgroundColor={`${cur_user_voted ? 'rgba(25, 135, 84, 0.5)' : 'transparent'}`}
          onClick={handleVote}
        >
          <Action color="#198754" label="Upvote" icon={BiUpvote} placement="top-end" />

          {upvotes_count > 0 && (
            <Box pt="0.2rem" textAlign="center" fontWeight="bold" color="text.primary">
              {upvotes_count}
            </Box>
          )}
        </Box>
        <Box>
          {`${location.pathname}` === `/${id}${slug}` ? (
            <Box onClick={handleOnClick}>
              <Action
                color="#0066FF"
                label="Comments"
                icon={ImBubble2}
                placement="top-end"
              />
            </Box>
          ) : (
            <Link as={RouterLink} to={`${id}${slug}`}>
              <Action
                color="#0066FF"
                label="Comments"
                icon={ImBubble2}
                placement="top-end"
              />
            </Link>
          )}
          {comments_count > 0 && (
            <Box textAlign="center" fontWeight="bold" color="text.primary">
              {comments_count}
            </Box>
          )}
        </Box>
        <Box onClick={toggleBookmark}>
          <Action
            color="#FFA500"
            label="Bookmark"
            icon={BsFillBookmarkStarFill}
            placement="top-end"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Actions;
