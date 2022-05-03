import { Box, Button, Checkbox, Text, Select } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { IGlobalContext, IPost, IPostsContext } from '../../interfaces';
import DevtrovePostListItem from './DevtrovePostListItem';
import { GlobalContext } from '../../context/global';
import BasicModal from '../Mixed/BasicModal';
import axios, { AxiosError } from 'axios';
import { PostsContext } from '../../context/posts';
import { http } from '../../helpers';
import Spinner from '../Mixed/Spinner';

export interface IDevtrovePostListProps {
  posts: IPost[];
}

const DevtrovePostList = ({ posts }: IDevtrovePostListProps) => {
  const { isModalOpen, theme, openModal, closeModal } = useContext(
    GlobalContext
  ) as IGlobalContext;
  const { someCheckedPosts, deleteCheckedPosts, checkedPostsList, toggleCheckAllPosts } =
    useContext(PostsContext) as IPostsContext;
  const [selectActive, setSelectActive] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isModalOpen) {
      toggleCheckAllPosts(false);
      setSelectActive(false);
      setAllChecked(false);
    }
  }, [isModalOpen]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (someCheckedPosts() && e.target.value === 'delete') {
      setSelectActive(true);
      return;
    }
    setSelectActive(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllChecked(e.target.checked);
    toggleCheckAllPosts(e.target.checked);
  };

  const handleDelete = async () => {
    try {
      setIsLoaded(false);
      const postIds = checkedPostsList();

      if (!postIds.length) return;
      deleteCheckedPosts(postIds);
      const response = await http.post('posts/devtrove-posts/delete/', {
        post_ids: postIds,
      });

      setIsLoaded(true);
      if (isLoaded) {
        closeModal();
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
      }
    }
  };

  const deSelectCheckedPosts = () => {
    toggleCheckAllPosts(false);
    closeModal();
    setSelectActive(false);
    setAllChecked(false);
  };

  return (
    <Box position="relative" pt="2rem">
      {!isLoaded && <Spinner text="Deleting posts..." />}
      <BasicModal>
        <Box className="delete-post-modal">
          <Text color="text.primary" textAlign="center" pt="3rem">
            Are you sure you want to delete?
          </Text>
          <Box mt="2rem" display="flex" justifyContent="center">
            <Button
              onClick={deSelectCheckedPosts}
              _hover={{ background: 'transparent' }}
              border="1px solid"
              bg="transparent"
              borderColor="purple.secondary"
              color={theme === 'dark' ? '#FFF' : '#000'}
              mx="1rem"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              _hover={{ background: 'transparent' }}
              border="1px solid"
              bg="transparent"
              borderColor="purple.secondary"
              color={theme === 'dark' ? '#FFF' : '#000'}
              mx="1rem"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </BasicModal>
      <Box>
        <Text textAlign="center" mb="1rem" color="text.primary">
          Select post to change
        </Text>
        <Box p="0.25rem" mb="1rem" display="flex" alignItems="center">
          <Select
            onChange={handleSelect}
            color={theme === 'dark' ? '#FFF' : '#000'}
            border="1px solid"
            borderColor="purple.secondary"
            width="185px"
            placeholder="-------"
          >
            <option value="delete">delete selected posts</option>
          </Select>
          {selectActive && (
            <Button onClick={openModal} mx="auto" pl="0.5rem">
              Go
            </Button>
          )}
        </Box>
      </Box>
      <Box>
        <Box display="flex" alignItems="center" mb="1.5rem">
          <Checkbox isChecked={allChecked} onChange={handleOnChange} ml="0.25rem" />
          <Text color={theme === 'dark' ? '#FFF' : '#000'} ml="1rem">
            All
          </Text>
        </Box>
        {posts.map((post) => {
          return <DevtrovePostListItem key={post.id} post={post} />;
        })}
      </Box>
    </Box>
  );
};

export default DevtrovePostList;
