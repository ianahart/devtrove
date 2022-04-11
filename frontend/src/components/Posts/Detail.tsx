import { Box } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { http } from '../../helpers';
import { IPost } from '../../interfaces';
import { useParams } from 'react-router-dom';
import DetailContent from './DetailContent';
const Detail = () => {
  let params = useParams();
  const [error, setError] = useState('');
  const [post, setPost] = useState<IPost | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      const response = await http.get<IPost>(`/posts/${params.id}/`);
      if (response.status === 200) {
        setPost(response.data);
      }
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
    <Box height="100%" minH="100vh" color="#FFF">
      <Box display="flex" flexDir="row" flexShrink="0">
        <Box
          flexGrow="1"
          fontSize="1rem"
          width="20rem"
          display={['none', 'none', 'block']}
          textAlign="center"
          border="1px solid #403d40"
          maxW="540px"
          color="#fff"
        >
          sidebar1
        </Box>
        <Box
          flexGrow="2"
          width="100%"
          height="100vh"
          border="1px solid #403d40"
          color="#FFF"
          textAlign="center"
          fontSize="1rem"
        >
          <DetailContent post={post as IPost} />
        </Box>
        <Box
          flexShrink="1"
          width="20rem"
          textAlign="center"
          border="1px solid #403d40"
          display={['none', 'none', 'block']}
          color="#FFF"
          fontSize="1rem"
        >
          sidebar2
        </Box>
      </Box>
    </Box>
  );
};

export default Detail;
