import { Box, Button, Icon, Heading, Image, Link, Text } from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { GlobalContext } from '../../../context/global';
import { IGlobalContext, IGroupsContext, IGroupUser } from '../../../interfaces';
import { useCallback, useContext, useEffect, useState } from 'react';
import { http } from '../../../helpers';
import { IGroupUserRequest } from '../../../interfaces/requests';
import ProfilePicture from '../../Account/ProfilePicture';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import Spinner from '../../Mixed/Spinner';
import { GroupsContext } from '../../../context/groups';

interface IGroupPost {
  title: string;
  cover_image: string;
  post_id: number | null;
  host: number | null;
  slug: string;
  user_id: number | null;
  count: string;
}

const GroupViewContents = () => {
  const initialPost = {
    title: '',
    cover_image: '',
    post_id: null,
    host: null,
    count: '',
    slug: '',
    user_id: null,
  };
  const params = useParams();
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const { removeGroup } = useContext(GroupsContext) as IGroupsContext;
  const { theme, userAuth } = useContext(GlobalContext) as IGlobalContext;
  const [post, setPost] = useState<IGroupPost>(initialPost);
  const [group, setGroup] = useState<IGroupUser[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const getGroupUsers = useCallback(async () => {
    try {
      setIsLoaded(false);
      setGroup([]);
      setPost({
        title: '',
        cover_image: '',
        post_id: null,
        host: null,
        count: '',
        slug: '',
        user_id: null,
      });
      const response = await http.get<IGroupUserRequest>(
        `/groups/users/?id=${params.groupId}`
      );
      setIsLoaded(true);
      setGroup((prevState) => [...prevState, ...response.data.group]);
      // @ts-ignore
      setPost(response.data.post);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setIsLoaded(true);
        setError(e.response?.data.error);
      }
    }
  }, [params.groupId]);

  useEffect(() => {
    setIsDeleted(false);
    getGroupUsers();
  }, [getGroupUsers, params.groupId]);

  const leaveGroup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (params.groupId === undefined || post.user_id === null) return;
    removeGroup(params.groupId, post.user_id);
    setPost(initialPost);
    setGroup([]);
    setIsDeleted(true);
  };

  const to = post.slug.startsWith('/')
    ? `/${post.post_id}${post.slug}`
    : `/${post.post_id}/${post.slug}`;

  return (
    <>
      {isDeleted ? (
        <Box></Box>
      ) : (
        <Box color={theme === 'dark' ? '#FFF' : '#000'}>
          {!isLoaded ? (
            <Spinner text="Loading..." />
          ) : (
            <Box>
              <Box alignItems="center" display="flex" justifyContent="center">
                {group.map((item) => {
                  return (
                    <Box key={item.group_user}>
                      <ProfilePicture
                        avatar_url={item.avatar_url}
                        width="40px"
                        height="40px"
                        borderRadius="50%"
                      />
                    </Box>
                  );
                })}
                {post.count.length > 0 && (
                  <Box display="flex" alignItems="center">
                    <Icon
                      ml="0.5rem"
                      as={AiOutlinePlusCircle}
                      color="text.primary"
                      fontSize="20px"
                    />
                    <Text color="text.primary" ml="0.25rem">
                      {post.count}
                    </Text>
                  </Box>
                )}
              </Box>
              <Box display="flex" justifyContent="flex-end">
                {post.host === userAuth.user.id ? (
                  <Button variant="transparentButton">Disband Group</Button>
                ) : (
                  <Button onClick={leaveGroup} variant="transparentButton">
                    Leave Group
                  </Button>
                )}
              </Box>
              <Box my="1.5rem" display="flex" flexDir="column" alignItems="center">
                <Link as={RouterLink} to={to}>
                  <Heading my="1.5rem" as="h2" fontSize="20px">
                    {post.title}
                  </Heading>
                </Link>
                <Image
                  borderRadius="12px"
                  height="150px"
                  src={post.cover_image}
                  alt={post.title}
                  margin="0 auto"
                  width="200px"
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default GroupViewContents;
