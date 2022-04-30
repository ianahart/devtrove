import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { ChangeEvent, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import { http } from '../../helpers';
import CoverUpload from './CoverUpload';

export interface ICoverFormProps {
  postId: number | null;
}

const CoverForm = ({ postId }: ICoverFormProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const [errors, setErrors] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>();
  const [dataURL, setDataURL] = useState<string>('');

  const applyErrors = (error: string) => {
    setErrors((prevState) => [...prevState, error]);
  };

  const addFile = (file: File) => setFile(file);
  const addDataURL = (URL: string) => setDataURL(URL);

  const clearFile = () => {
    setDataURL('');
    setFile(null);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setErrors([]);
      if (dataURL!.length === 0 || title.trim().length === 0) {
        setErrors((prevState) => [
          ...prevState,
          'Make sure to provide a title and a cover photo.',
        ]);
      }
      console.log(postId);
      if (postId === null) return;
      //const response = await http.patch(`/devtrove-posts/${postId}/`);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
      }
    }
  };

  return (
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
        <Box display="flex" justifyContent="flex-end" p="0.5rem" my="3rem">
          <Button type="submit" variant="secondaryButton">
            Submit Cover
          </Button>
        </Box>
      </form>
    </Box>
  );
};
export default CoverForm;
