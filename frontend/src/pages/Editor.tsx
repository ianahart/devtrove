import { Box, Button, Text } from '@chakra-ui/react';
import { useCallback, useRef, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { http } from '../helpers';
import Spinner from '../components/Mixed/Spinner';
import { GlobalContext } from '../context/global';
import { IGlobalContext } from '../interfaces';
import CoverForm from '../components/Editor/CoverForm';

const Editor = () => {
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const [content, setContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const [PostUploaded, setPostUploaded] = useState(false);
  const [error, setError] = useState('');
  const [postId, setPostId] = useState(null);
  const QuillRef = useRef<ReactQuill>();
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  const handleOnSubmit = useCallback(async () => {
    try {
      setError('');
      setPostUploaded(true);
      setIsLoaded(false);
      if (QuillRef.current) {
        if (QuillRef.current!.editor!.getLength() <= 1) {
          setIsLoaded(true);
          setPostUploaded(false);
          return;
        }

        const response = await http.post(`/posts/devtrove-posts/`, {
          user: userAuth.user.id,
          author: userAuth.user.handle,
          author_pic: userAuth.user.avatar_url,
          post: QuillRef.current.editor?.getContents(),
        });
        setIsLoaded(true);
        setPostId(response.data.devtrove_post.id);
      }
    } catch (e: unknown | AxiosError) {
      setIsLoaded(true);
      setPostUploaded(false);
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.error);
      }
    }
  }, [userAuth.user.id, userAuth.user.handle, userAuth.user.avatar_url]);

  const onChange = (content: any, delta: any, source: any, editor: any) => {
    setContent(editor.getContents());
  };

  return (
    <>
      {!isLoaded ? (
        <Spinner text="Submitting your post..." />
      ) : (
        <Box>
          {!PostUploaded ? (
            <Box
              padding="0.5rem"
              margin="4rem auto 2rem auto"
              width={['95%', '95%', '750px']}
              minH="300px"
              bg="#FFF"
              borderRadius="12px"
              boxShadow="md"
            >
              {error && (
                <Text textAlign="center" color="text.primary">
                  {error}
                </Text>
              )}{' '}
              <ReactQuill
                //@ts-ignore
                ref={QuillRef}
                theme="snow"
                value={content}
                modules={modules}
                formats={formats}
                onChange={onChange}
              />
              <Box my="2rem">
                <Button onClick={handleOnSubmit} variant="secondaryButton">
                  Submit Post
                </Button>
              </Box>
            </Box>
          ) : (
            <CoverForm postId={postId} />
          )}
        </Box>
      )}
    </>
  );
};
export default Editor;
