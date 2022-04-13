import { Box, Link } from '@chakra-ui/react';
import { useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { BiUpvote } from 'react-icons/bi';
import { ImBubble2 } from 'react-icons/im';
import { BsFillBookmarkStarFill } from 'react-icons/bs';
import Action from './Action';
import { IActionsProps } from '../../interfaces';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
const Actions = ({ id, slug }: IActionsProps) => {
  const { openModal } = useContext(GlobalContext) as IGlobalContext;
  const location = useLocation();

  const upvote = () => {
    console.log(`Upvoting post: ${id}`);
  };

  const toggleBookmark = () => {
    console.log(`Toggling bookmark of post: ${id}`);
  };

  const handleOnClick = () => {
    openModal();
  };

  return (
    <Box
      flexDir="column"
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      my="0.25rem"
    >
      <Box width="100%" display="flex" justifyContent="space-between" p="0.25rem">
        <Box onClick={upvote}>
          <Action color="#198754" label="Upvote" icon={BiUpvote} placement="top-end" />
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
