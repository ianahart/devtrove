import { Box, Button, Heading, Icon, Text } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IHistoryPagination, IGlobalContext, IHistoryPost } from '../interfaces';
import { IHistoryRequest } from '../interfaces/requests';
import { GlobalContext } from '../context/global';
import { http } from '../helpers';
import HistoryPost from '../components/History/HistoryPost';
import { AiOutlineEye } from 'react-icons/ai';

const ReadingHistory = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [todayPosts, setTodayPosts] = useState<IHistoryPost[]>([]);
  const [previousPosts, setPreviousPosts] = useState<IHistoryPost[]>([]);
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const [pagination, setPagination] = useState<IHistoryPagination>({
    read_count: 0,
    page: 1,
    has_next_page: false,
  });

  const fetchHistory = useCallback(async () => {
    try {
      const response = await http.get<IHistoryRequest>('/history/?page=0');
      setTodayPosts(response.data.today_posts);
      setPreviousPosts(response.data.previous_posts);
      setPagination((prevState) => ({ ...prevState, ...response.data.pagination }));
      setIsLoaded(true);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setIsLoaded(true);
        setError(e.response?.data.error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      fetchHistory();
    }
  }, [isLoaded, fetchHistory]);

  const loadMore = async () => {
    try {
      const response = await http.get<IHistoryRequest>(
        `/history/?page=${pagination!.page}`
      );
      setTodayPosts((prevState) => [...prevState, ...response.data.today_posts]);
      setPreviousPosts((prevState) => [...prevState, ...response.data.previous_posts]);
      setPagination((prevState) => ({ ...prevState, ...response.data.pagination }));
      setIsLoaded(true);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setIsLoaded(true);
        setError(e.response?.data.error);
      }
    }
  };

  const remove = (id: number) => {
    let posts = todayPosts.filter((post) => post.id !== id);
    if (posts.length === todayPosts.length) {
      posts = previousPosts.filter((post) => post.id !== id);
      setPreviousPosts(posts);
    } else {
      setTodayPosts(posts);
    }
  };

  const deleteHistory = async (id: number) => {
    try {
      await http.delete(`/history/${id}/`);
      remove(id);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.error);
      }
    }
  };

  const postsBlock = (posts: IHistoryPost[], message: string) => {
    if (posts.length) {
      return posts.map((post) => {
        return <HistoryPost deleteHistory={deleteHistory} key={post.id} history={post} />;
      });
    }
    return (
      <Text p="0.5rem" color="purple.tertiary" fontSize="1.1rem">
        {message}
      </Text>
    );
  };

  return (
    <Box minH="100vh" margin="0 auto" width="100%" display="flex">
      <Box
        className="history-sidebar"
        width="100%"
        minW="250px"
        borderRight="1px solid"
        borderColor="text.secondary"
      ></Box>
      <Box className="history-posts">
        <Box display="flex" mt="2rem" flexDir="column" alignItems="center">
          <Heading as="h1" color="purple.tertiary">
            <Icon mr="0.5rem" color="purple.secondary" as={AiOutlineEye} />
            Reading History
          </Heading>
          <Text fontSize="1.2rem" mt="0.5rem" color="purple.tertiary">
            <Box as="span" color="purple.secondary">
              {pagination.read_count}
            </Box>
            /3 articles read today
          </Text>
        </Box>
        <Heading m="1rem" as="h2" color="purple.tertiary" fontSize="1.5rem">
          Today
        </Heading>
        {postsBlock(todayPosts, 'No reading history found from today.')}
        <Heading m="1rem" as="h2" color="purple.tertiary" fontSize="1.5rem">
          Older
        </Heading>
        {postsBlock(previousPosts, 'No reading history found older than a day.')}
        {pagination?.has_next_page && <Button onClick={loadMore}>Load more...</Button>}
      </Box>
      <Box
        className="history-sidebar"
        minW="250px"
        width="100%"
        borderLeft="1px solid"
        borderColor="text.secondary"
      ></Box>
    </Box>
  );
};

export default ReadingHistory;
