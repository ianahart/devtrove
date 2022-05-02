import { Box, Heading, Image, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import ReactQuill, { Value } from 'react-quill';
import Logo from '../Mixed/Logo';
import { http } from '../../helpers';
import ProfilePicture from '../Account/ProfilePicture';

export interface IDevtrovePost {
  author: string;
  author_pic: string;
  cover_image?: string;
  published_date: string;
  title: string;
  post: Value;
}

const DevtrovePost = () => {
  const params = useParams();
  const [value, setValue] = useState<IDevtrovePost | null>(null);
  const [error, setError] = useState('');
  const modules = { toolbar: [] };

  const fetchPost = useCallback(async () => {
    try {
      const response = await http.get(`/posts/devtrove-posts/${params.id}/`, {});
      console.log(response);
      setValue(response.data);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        setError(e.response?.data.error);
      }
    }
  }, [params.id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <>
      <Box
        p="1rem"
        width={['95%', '95%', '750px']}
        margin="2rem auto 0 auto"
        borderTopRadius="12px"
        boxShadow="md"
        bg="#FFF"
      >
        <Box display="flex" justifyContent="flex-start">
          <Box>
            <ProfilePicture
              borderRadius="50%"
              width="45px"
              height="45px"
              avatar_url={value?.author_pic}
            />
          </Box>
          <Box pl="1rem" display="flex" flexDir="column">
            <Text fontWeight="700" color="dark.secondary">
              {value?.author}
            </Text>
            <Text fontSize="0.85rem" color="text.secondary">
              {value?.published_date}
            </Text>
          </Box>
        </Box>
        <Box textAlign="center" m="2rem auto 3rem auto">
          <Heading fontSize="26px" color="text.secondary">
            {value?.title}
          </Heading>
        </Box>
        <Box display="flex" mb="3rem" justifyContent="center">
          <Image
            borderRadius="12px"
            width={['95%', '95%', '70%']}
            height="200px"
            src={value?.cover_image}
            alt={value?.title}
          />
        </Box>
      </Box>
      <Box
        width={['95%', '95%', '750px']}
        margin="0 auto 2rem auto"
        borderBottomRadius="12px"
        boxShadow="md"
        bg="#FFF"
      >
        {value && value.post && (
          <ReactQuill theme="bubble" readOnly modules={modules} value={value.post} />
        )}
      </Box>
    </>
  );
};

export default DevtrovePost;
