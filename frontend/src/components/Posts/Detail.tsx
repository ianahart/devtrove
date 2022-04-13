import { Box, useToast } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { http } from '../../helpers';
import { useParams } from 'react-router-dom';
import DetailContent from './DetailContent';
import Spinner from '../Mixed/Spinner';
import BasicModal from '../Mixed/BasicModal';
import LoginForm from '../Forms/LoginForm';
import CommentForm from '../Forms/CommentForm';
import Comments from './Comments';
import { ICommentsRequest } from '../../interfaces/requests';
import { IPost, IGlobalContext, IComment, IFormField } from '../../interfaces';
import { GlobalContext } from '../../context/global';

const Detail = () => {
  let params = useParams();
  const toast = useToast();
  const { userAuth, closeModal } = useContext(GlobalContext) as IGlobalContext;
  const [error, setError] = useState('');
  const [post, setPost] = useState<IPost>();

  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [offset, setOffset] = useState(3);
  const [page, setPage] = useState(1);

  const [commentError, setCommentError] = useState('');
  const [commentField, setCommentField] = useState<IFormField>({
    name: 'comment',
    value: '',
    error: '',
  });
  const [codeField, setCodeField] = useState<IFormField>({
    name: 'code',
    value: '',
    error: '',
  });
  const [language, setLanguage] = useState('');

  const resetForm = () => {
    const resetCommentField = Object.assign(
      {},
      { name: 'comment', value: '', error: '' }
    );
    const resetCodeField = Object.assign({}, { name: 'code', value: '', error: '' });
    setCommentField(resetCommentField);
    setCodeField(resetCodeField);
  };

  const captureInput = (input: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = input.target;
    if (name === 'comment') {
      setCommentField((prevState) => ({ ...prevState, value }));
      return;
    }
    setCodeField((prevState) => ({ ...prevState, value }));
  };

  const handleSelectLanguage = (value: string) => {
    setLanguage(value);
  };

  const applyCommentErrors = <T extends { [key: string]: string[] }>(error: T) => {
    for (let key in error) {
      setCommentError(error[key][0]);
    }
  };
  const clearCommentError = () => {
    setCommentError('');
  };

  const handleCommentOperation = async () => {
    setComments([]);
    setPage(1);
    await fetchComments();
  };

  const addComment = async () => {
    try {
      clearCommentError();
      if (codeField.value.trim().length === 0 && commentField.value.trim().length === 0) {
        return;
      }
      const response = await http.post(`/comments/`, {
        user: userAuth.user.id,
        post: params.id,
        code_snippet: codeField.value,
        text: commentField.value,
        language: language,
      });
      if (response.status === 201) {
        handleCommentOperation();
        closeModal();
        toast({
          title: 'Comment added.',
          description: 'Remember to be respectful.',
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        applyCommentErrors(e.response?.data.error);
      }
    }
  };

  const fetchComments = useCallback(async () => {
    try {
      const response = await http.get<ICommentsRequest>(
        `/comments/?post=${params.id}&page=0&offset=${offset}`
      );
      if (response.status === 200) {
        const { comments, page, has_next_page } = response.data;
        setComments(comments);
        setPage(page);
        if (!has_next_page) {
          toast({
            title: 'All comments loaded.',
            description: 'No more comments for this post currently.',
            status: 'info',
            duration: 6000,
            isClosable: true,
          });
          setCommentsLoaded(true);
        }
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.error);
      }
    }
  }, [toast, offset, params.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePagination = async () => {
    try {
      if (!post) return;
      const response = await http.get<ICommentsRequest>(
        `/comments/?post=${post.id}&page=${page}&offset=${offset}`
      );
      if (response.status === 200) {
        const { comments: data, page, has_next_page } = response.data;
        setPage(page);
        setComments((prevState) => [...comments, ...data]);
        if (!has_next_page) {
          setCommentsLoaded(true);
          toast({
            title: 'All comments loaded.',
            description: 'No more comments for this post currently.',
            status: 'info',
            duration: 6000,
            isClosable: true,
          });
        }
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.error);
      }
    }
  };
  const fetchPost = useCallback(async () => {
    try {
      const response = await http.get<IPost>(`/posts/${params.id}/`);
      if (response.status === 200) {
        setPost(response.data);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.error);
      }
    }
  }, [params.id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <Box position="relative" height="100%" minH="100vh" color="#FFF">
      {!post && <Spinner text="Loading Article..." />}
      <Box display="flex" flexDir="row" flexShrink="0">
        <Box
          flexGrow="1"
          fontSize="1rem"
          width="20rem"
          display={['none', 'none', 'block']}
          textAlign="center"
          maxW="540px"
          color="#fff"
        >
          sidebar1
        </Box>
        <Box
          flexGrow="2"
          width="100%"
          height="100%"
          minH="100vh"
          border="1px solid #403d40"
          borderTopColor="transparent"
          color="#FFF"
          textAlign="center"
          fontSize="1rem"
        >
          <DetailContent post={post as IPost} />
          <BasicModal resetForm={resetForm}>
            {userAuth.user.logged_in ? (
              <CommentForm
                codeField={codeField}
                commentError={commentError}
                clearCommentError={clearCommentError}
                captureInput={captureInput}
                addComment={addComment}
                handleSelectLanguage={handleSelectLanguage}
                commentField={commentField}
                language={language}
                post={post as IPost}
              />
            ) : (
              <LoginForm />
            )}
          </BasicModal>
          <Box
            borderTopWidth="1px"
            borderTopColor="#403d40"
            borderTopStyle="solid"
            borderBottomWidth="1px"
            borderBottomColor="#403d40"
            borderBottomStyle="solid"
            margin="0 auto"
            width={['100%', '90%', '640px']}
          >
            {post !== null && (
              <Comments
                comments={comments}
                commentsLoaded={commentsLoaded}
                handlePagination={handlePagination}
                handleCommentOperation={handleCommentOperation}
                post={post as IPost}
              />
            )}
          </Box>
        </Box>
        <Box
          flexShrink="1"
          width="20rem"
          textAlign="center"
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
