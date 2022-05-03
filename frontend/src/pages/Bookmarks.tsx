import { Box, Button, Grid, Icon, Text } from '@chakra-ui/react';
import { BsBookmarks } from 'react-icons/bs';
import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IBookmark } from '../interfaces';
import Bookmark from '../components/Bookmarks/Bookmark';
import { IBookmarkRequest } from '../interfaces/requests';
import { http } from '../helpers';
import Spinner from '../components/Mixed/Spinner';
import GoBack from '../components/Mixed/GoBack';

type Dir = 'next' | 'previous';

const Bookmarks = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<IBookmark[]>([]);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [pageRange, setPageRange] = useState<{ start: number; end: number }>();

  const deleteBookmark = async (id: number) => {
    try {
      await http.delete(`/bookmarks/${id}/`);
      const filtered = [...bookmarkedPosts].filter((bookmark) => bookmark.id !== id);
      setBookmarkedPosts(filtered);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
        setError(e.response?.data.error);
      }
    }
  };

  const paginate = async (dir: Dir) => {
    try {
      const response = await http.get<IBookmarkRequest>(
        `/bookmarks/?page=${page}&dir=${dir}`
      );
      setIsLoaded(true);
      setPage(response.data.paginator.page);
      setPageRange({
        start: response.data.paginator.start,
        end: response.data.paginator.end,
      });
      setBookmarkedPosts(response.data.bookmarked_posts);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setIsLoaded(true);
        setError(e.response!.data.error);
      }
    }
  };

  const fetchBookmarkedPosts = useCallback(async () => {
    try {
      const response = await http.get<IBookmarkRequest>('/bookmarks/?page=0&dir=next');
      setIsLoaded(true);
      setPage(response.data.paginator.page);
      setBookmarkedPosts(response.data.bookmarked_posts);
      setPageRange({
        start: response.data.paginator.start,
        end: response.data.paginator.end,
      });
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setIsLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      fetchBookmarkedPosts();
    }
  }, [isLoaded, fetchBookmarkedPosts]);

  return (
    <>
      {!isLoaded && <Spinner text="Loading your posts..." />}
      {bookmarkedPosts.length === 0 ? (
        <Box my="3rem" textAlign="center">
          <Text color="purple.secondary" fontSize="26px">
            You currently do not have any posts bookmarked.
          </Text>
        </Box>
      ) : (
        <Box>
          <GoBack />
          <Box mt="3rem" display="flex" alignItems="center" justifyContent="center">
            <Icon ml="1rem" as={BsBookmarks} color="purple.secondary" fontSize="30px" />
            <Text fontSize="26px" color="purple.tertiary">
              Your current bookmarks
            </Text>
          </Box>
          {bookmarkedPosts.length > 0 && (
            <Grid
              className="bookmarks"
              mt="6rem"
              mb="3rem"
              gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
              gap="20px"
            >
              {bookmarkedPosts.length > 0 &&
                bookmarkedPosts.map((bookmark) => {
                  return (
                    <Bookmark
                      deleteBookmark={deleteBookmark}
                      key={bookmark.id}
                      bookmark={bookmark}
                    />
                  );
                })}
            </Grid>
          )}
          <Box display="flex" alignItems="center" justifyContent="center">
            {pageRange !== undefined && page > pageRange.start && (
              <Button
                fontSize="1.35rem"
                _hover={{
                  color: '#d0cbcb',
                  background: 'transparent',
                }}
                layerStyle="paginationBtn"
                onClick={() => paginate('previous')}
                mr="1rem"
              >
                Previous
              </Button>
            )}
            {pageRange !== undefined && (
              <Text fontSize="1.1rem" color="#FFF">
                {page} of {pageRange.end}
              </Text>
            )}
            {pageRange !== undefined && page < pageRange.end && (
              <Button
                fontSize="1.35rem"
                _hover={{
                  color: '#d0cbcb',
                  background: 'transparent',
                }}
                layerStyle="paginationBtn"
                onClick={() => paginate('next')}
                ml="1rem"
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Bookmarks;
