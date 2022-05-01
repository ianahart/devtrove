import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import ReactQuill from 'react-quill';
import { http } from '../../helpers';

const DevtrovePost = () => {
  const params = useParams();
  const [value, setValue] = useState();
  const [error, setError] = useState('');
  const modules = { toolbar: [] };

  const fetchPost = useCallback(async () => {
    try {
      const response = await http.get(`/posts/devtrove-posts/${params.id}/`, {});
      console.log(response);
      setValue(response.data.post);
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
    <Box
      width={['95%', '95%', '750px']}
      margin="3rem auto 2rem auto"
      borderRadius="12px"
      boxShadow="md"
      bg="#FFF"
    >
      <ReactQuill readOnly modules={modules} value={value} />
    </Box>
  );
};

export default DevtrovePost;
