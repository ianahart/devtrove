import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { filterXSS } from 'xss';
import { ChangeEvent, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import Spinner from '../Mixed/Spinner';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import { http } from '../../helpers';
import CoverUpload from './CoverUpload';
import Tag from './Tag';
import { ICoverFormProps, CreateTag } from '../../interfaces';

const CoverForm = ({ postId }: ICoverFormProps) => {
  const navigate = useNavigate();
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [tags, setTags] = useState<CreateTag[]>([]);
  const [title, setTitle] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [dataURL, setDataURL] = useState<string>('');
  const [file, setFile] = useState<File | null>();

  const applyErrors = (error: string) => {
    setErrors((prevState) => [...prevState, error]);
  };

  const addFile = (file: File) => setFile(file);

  const addDataURL = (URL: string) => setDataURL(URL);

  const removeTag = (id: string) => setTags([...tags].filter((tag) => tag.id !== id));

  const clearFile = () => {
    setDataURL('');
    setFile(null);
  };

  const addTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (tags.length === 5) {
      setErrors((prevState) => [...prevState, 'Maximum of 5 post tags.']);
    }
    e.stopPropagation();
    setTags((prevState) => [
      ...prevState,
      { id: nanoid(), tag: filterXSS(`#${tagInput}`) },
    ]);
    setTagInput('');
  };

  const validate = (tags: CreateTag[], file: File, title: string) => {
    setErrors([]);
    if (!tags.length) {
      setErrors((prevState) => [...prevState, 'Make sure to provide at least one tag.']);
    }
    if (file === undefined || title.trim().length === 0) {
      setErrors((prevState) => [
        ...prevState,
        'Make sure to provide a title and a cover photo.',
      ]);
    }
    if (tags.some((tag) => (tag.tag.length as number) > 50)) {
      setErrors((prevState) => [...prevState, 'Please keep tags under 50 characters.']);
    }
    return errors.length ? true : false;
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoaded(false);
      e.preventDefault();
      if (file === null || file === undefined) return;
      if (validate(tags, file, title)) {
        return;
      }
      if (postId === null) return;
      const formData = new FormData();
      if (file) {
        formData.append('tags', JSON.stringify(Object.values(tags)));
        formData.append('title', title);
        formData.append('cover_image', file);
        formData.append('post', postId.toString());
        if (errors.length) return;
        const response = await http.patch(`/posts/devtrove-posts/${postId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setIsLoaded(true);
        if (isLoaded) {
          navigate('/');
        }
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        if (e.response?.status === 400) {
          console.log(e.response);
          const error: string = Object.values(e.response.data.error)[0] as string;
          applyErrors(error);
        }
      }
    }
  };

  return (
    <>
      {!isLoaded ? (
        <Spinner text="Submitting post cover..." />
      ) : (
        <Box
          color={theme === 'dark' ? '#FFF' : '#000'}
          m="3rem auto 2rem auto"
          borderColor="text.secondary"
          borderWidth="1px"
          bg={theme === 'dark' ? 'transparent' : '#FFF'}
          borderRadius="12px"
          minH="500px"
          boxShadow="md"
          width={['95%', '95%', '760px']}
        >
          <form onSubmit={handleOnSubmit}>
            <Box textAlign="center" m="2rem auto 2rem auto">
              <Heading fontSize="22px">Cover Details</Heading>
              <Box m="2rem auto 1rem auto">
                {errors.map((error: string) => {
                  return (
                    <Text key={nanoid()} textAlign="center" color="purple.secondary">
                      {error}
                    </Text>
                  );
                })}
              </Box>
            </Box>
            <FormControl margin="0 auto" width={['90%', '90%', '70%']} mb="3rem">
              <FormLabel fontWeight="bold">Title:</FormLabel>
              <Input
                name="title"
                type="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                color={theme === 'dark' ? '#FFF' : '#000'}
                borderRadius="0"
                borderLeft="none"
                borderRight="none"
                borderTop="none"
                variant="inputEntry"
              />
            </FormControl>
            <CoverUpload
              dataURL={dataURL ?? ''}
              addDataURL={addDataURL}
              addFile={addFile}
              applyErrors={applyErrors}
              clearFile={clearFile}
            />

            <Box margin="0 auto" width={['90%', '90%', '70%']} mb="3rem" pt="2rem">
              <FormControl>
                <FormLabel fontWeight="bold">Tags:</FormLabel>
                <Box display="flex" alignItems="center">
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTagInput(e.target.value)
                    }
                    value={tagInput}
                    color={theme === 'dark' ? '#FFF' : '#000'}
                    borderRadius="0"
                    borderLeft="none"
                    borderRight="none"
                    borderTop="none"
                    variant="inputEntry"
                  />
                  {tags.length < 5 && (
                    <Button
                      onClick={addTag}
                      _hover={{ bg: 'transparent' }}
                      ml="1rem"
                      borderStyle="solid"
                      bg="transparent"
                      borderWidth="1px"
                      borderColor="purple.secondary"
                    >
                      Add tag
                    </Button>
                  )}
                </Box>
              </FormControl>
              <Box
                maxW="300px"
                display="flex"
                mt="3rem"
                justifyContent="space-around"
                flexWrap="wrap"
              >
                {tags.map((tag) => {
                  return <Tag removeTag={removeTag} editorTag={tag} key={tag.id} />;
                })}
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end" p="0.5rem" my="3rem">
              <Button type="submit" variant="secondaryButton">
                Submit Cover
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </>
  );
};
export default CoverForm;
