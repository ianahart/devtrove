import { Box, Button, Icon, Heading, Image, Link, Text } from '@chakra-ui/react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { GlobalContext } from '../../../context/global';
import Chat from './Chat';
import {
  IGroupData,
  IGlobalContext,
  IGroupsContext,
  IGroupUser,
} from '../../../interfaces';
import { useCallback, useContext, useEffect, useState } from 'react';
import { http } from '../../../helpers';
import { IGroupUserRequest } from '../../../interfaces/requests';
import ProfilePicture from '../../Account/ProfilePicture';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import Spinner from '../../Mixed/Spinner';
import { GroupsContext } from '../../../context/groups';

const GroupViewContents = () => {
  const initialGroupData = {
    title: '',
    cover_image: '',
    post_id: null,
    host: null,
    count: '',
    slug: '',
    user_id: null,
    group_id: null,
    id: null,
    group_title: '',
  };
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const { removeGroup, disbandGroup } = useContext(GroupsContext) as IGroupsContext;
  const { theme, userAuth } = useContext(GlobalContext) as IGlobalContext;
  const [groupData, setGroupData] = useState<IGroupData>(initialGroupData);
  const [group, setGroup] = useState<IGroupUser[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const getGroupUsers = useCallback(async () => {
    try {
      setIsLoaded(false);
      setGroup([]);
      setGroupData({
        title: '',
        cover_image: '',
        post_id: null,
        host: null,
        count: '',
        slug: '',
        user_id: null,
        group_id: null,
        id: null,
        group_title: '',
      });
      const response = await http.get<IGroupUserRequest>(
        `/groups/users/?id=${params.groupId}`
      );
      setIsLoaded(true);
      setGroup((prevState) => [...prevState, ...response.data.group]);
      setGroupData(response.data.group_data);
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
    localStorage.setItem('group_id', JSON.stringify(params.groupId));
  }, [getGroupUsers, params.groupId]);

  const leaveGroup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (params.groupId === undefined || groupData.user_id === null) return;
    removeGroup(params.groupId, groupData.user_id);
    setGroupData(initialGroupData);
    setGroup([]);
    setIsDeleted(true);
  };

  const deleteGroup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const userIds = [...group].map((member) => member.group_user);
    if (params.groupId === undefined) return;
    disbandGroup(params.groupId, userIds);
    setGroupData(initialGroupData);
    setGroup([]);
    setIsDeleted(true);
    navigate(`/${userAuth.user.handle}/groups/`);
  };
  let to = '/';
  if (groupData.slug) {
    to = groupData.slug.startsWith('/')
      ? `/${groupData.post_id}${groupData.slug}`
      : `/${groupData.post_id}/${groupData.slug}`;
  }

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
              <Box textAlign="center" mt="-5rem" p="0.5rem">
                <Text fontWeight="bold" fontSize="1.1rem">
                  {groupData.group_title}
                </Text>
              </Box>
              <Box p="0.5rem" alignItems="center" display="flex" justifyContent="center">
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
                {groupData.count && groupData.count.length > 0 && (
                  <Box display="flex" alignItems="center">
                    <Icon
                      ml="0.5rem"
                      as={AiOutlinePlusCircle}
                      color="text.primary"
                      fontSize="20px"
                    />
                    <Text color="text.primary" ml="0.25rem">
                      {groupData.count}
                    </Text>
                  </Box>
                )}
              </Box>
              <Box p="0.5rem" display="flex" justifyContent="flex-end">
                {groupData.host === userAuth.user.id ? (
                  <Button onClick={deleteGroup} variant="transparentButton">
                    Disband Group
                  </Button>
                ) : (
                  <Button onClick={leaveGroup} variant="transparentButton">
                    Leave Group
                  </Button>
                )}
              </Box>
              <Box my="1.5rem" display="flex" flexDir="column" alignItems="center">
                <Link as={RouterLink} to={to}>
                  <Heading p="0.25rem" my="1.5rem" as="h2" fontSize="20px">
                    {groupData.title}
                  </Heading>
                </Link>
                <Image
                  borderRadius="12px"
                  height="160px"
                  src={groupData.cover_image}
                  alt={groupData.title}
                  margin="0 auto"
                  width={['90%', '320px', '320px']}
                />
              </Box>
              {groupData.group_id !== null && <Chat group={groupData} />}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default GroupViewContents;
