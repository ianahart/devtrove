import { Box, Link, useToast } from '@chakra-ui/react';
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
import { IPostsContext, IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
import { PostsContext } from '../../context/posts';

const Actions = ({
  id,
  cur_user_voted,
  cur_user_bookmarked,
  upvotes_count,
  updatePostUpvote,
  updateDetailBookmark,
  slug,
  comments_count,
}: IActionsProps) => {
  const navigate = useNavigate();
  const { openModal, userAuth } = useContext(GlobalContext) as IGlobalContext;
  const { bookmark } = useContext(PostsContext) as IPostsContext;
  const toast = useToast();
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

  const toggleBookmark = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (!userAuth.user.logged_in) {
      return;
    }
    console.log(cur_user_bookmarked);
    if (!userAuth.user.id) return;
    if (userAuth.user.id) {
      if (!cur_user_bookmarked) {
        if (updateDetailBookmark) {
          updateDetailBookmark(true);
        }
        bookmark(id, userAuth.user.id, 'bookmark');
      } else {
        if (updateDetailBookmark) {
          updateDetailBookmark(false);
        }
        bookmark(id, userAuth.user.id, 'unbookmark');
      }
    }
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
      display="flex"
      minHeight="50px"
      alignItems="center"
      my="0.25rem"
    >
      <Box width="100%" display="flex" justifyContent="space-between" px="0.25rem">
        <Box borderRadius="50%" height="30px" width="30px" onClick={handleVote}>
          <Action
            color="#198754"
            activeIcon={cur_user_voted}
            count={upvotes_count}
            label="Upvote"
            icon={BiUpvote}
            placement="top-end"
          />
        </Box>
        <Box>
          {`${location.pathname}` === `/${id}${slug}` ? (
            <Box onClick={handleOnClick}>
              <Action
                color="#0066FF"
                label="Comments"
                count={comments_count}
                activeIcon={false}
                icon={ImBubble2}
                placement="top-end"
              />
            </Box>
          ) : (
            <Link as={RouterLink} to={`${id}${slug}`}>
              <Action
                color="#0066FF"
                count={comments_count}
                activeIcon={false}
                label="Comments"
                icon={ImBubble2}
                placement="top-end"
              />
            </Link>
          )}
        </Box>
        <Box onClick={toggleBookmark}>
          <Action
            color="#FFA500"
            activeIcon={cur_user_bookmarked}
            count={0}
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
