import { Box, Button, Icon, Textarea, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { FaDev } from 'react-icons/fa';
import { GlobalContext } from '../../context/global';
import LanguageSelect from '../Posts/LanguageSelect';
import CommentCodeBlock from '../Posts/CommentCodeBlock';
import { ICommentFormProps } from '../../interfaces/props';
import { IGlobalContext } from '../../interfaces';
import ProfilePicture from '../Account/ProfilePicture';

enum Options {
  Add = 'ADD',
  Preview = 'PREVIEW',
}

const CommentForm = ({
  post,
  codeField,
  commentError,
  writeMode,
  editComment,
  clearCommentError,
  commentField,
  language,
  captureInput,
  addComment,
  handleSelectLanguage,
}: ICommentFormProps) => {
  const { userAuth, theme } = useContext(GlobalContext) as IGlobalContext;
  const [view, setView] = useState(Options.Add);
  const switchView = (view: Options) => {
    setView(view);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    captureInput(e);
  };
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (writeMode === 'add') {
      addComment();
    } else {
      editComment();
    }
  };

  return (
    <Box height="100%">
      <Box
        mt="3rem"
        borderBottomColor="#403d40"
        borderBottomWidth="1px"
        borderBottomStyle="solid"
      >
        <Box display="flex" alignItems="center" justifyContent="flex-end" color="pink">
          <Text
            onClick={() => switchView(Options.Add)}
            fontWeight={view === Options.Add ? 'bold' : '200'}
            cursor="pointer"
            color={theme === 'dark' ? '#FFF' : '#000'}
            mr="1rem"
          >
            Add
          </Text>
          <Text
            onClick={() => switchView(Options.Preview)}
            fontWeight={view === Options.Preview ? 'bold' : '200'}
            cursor="pointer"
            color={theme === 'dark' ? '#FFF' : '#000'}
            ml="1rem"
          >
            Preview
          </Text>
        </Box>
      </Box>
      {view === Options.Preview ? (
        <Box>
          <Text my="2rem" fontWeight="bold" color="#FFF" fontSize="0.9rem">
            {commentField.value}
          </Text>
          {codeField.value && (
            <CommentCodeBlock code={codeField.value} language={language} />
          )}
        </Box>
      ) : (
        <form onSubmit={handleOnSubmit} style={{ marginTop: '2rem' }}>
          {commentError.length > 0 && (
            <Text textAlign="center" color="purple.secondary">
              {commentError}
            </Text>
          )}
          <Box
            backgroundColor="#292629"
            boxShadow="lg"
            p="1rem"
            borderRadius="12px"
            as="header"
          >
            <Box display="flex" alignItems="center">
              <Icon mr="0.5rem" as={FaDev} width="40px" color="#FFF" height="40px" />
              <Text alignSelf="flex-end" fontSize="1.1rem" color="#FFF">
                Dev To
              </Text>
            </Box>
            <Text mt="0.25rem" fontSize="0.9rem" color="text.primary">
              {post.published_date}
            </Text>
            <Text fontWeight="700" color="#FFF" mt="0.25rem" fontSize="0.9rem">
              Title: {post.title}
            </Text>
          </Box>
          <Box>
            <Text
              color="purple.secondary"
              fontWeight="bold"
              fontSize="0.8rem"
              my="1.5rem"
              mb="0.5rem"
            >
              <Box as="span" color="text.primary">
                Replying to:
              </Box>{' '}
              DevTo
            </Text>
            <Box p="0.25rem" display="flex" alignItems="center">
              <Box alignSelf="baseline">
                <ProfilePicture
                  borderRadius="50%"
                  avatar_url={userAuth.user.avatar_url}
                  height="40px"
                  width="40px"
                />
              </Box>
              <Textarea
                _focus={{ border: 'none' }}
                border="none"
                color={theme === 'dark' ? '#FFF' : '#000'}
                resize="none"
                outline="none"
                height="100%"
                fontSize="0.9rem"
                placeholder="Drop a comment..."
                value={commentField.value}
                name={commentField.name}
                onChange={handleOnChange}
                id="commentField"
              />
            </Box>
            <Textarea
              _focus={{ border: 'none' }}
              border="none"
              color={theme === 'dark' ? '#FFF' : '#000'}
              resize="none"
              outline="none"
              height="100%"
              fontSize="0.9rem"
              placeholder="Drop a code snippet..."
              value={codeField.value}
              name={codeField.name}
              onChange={captureInput}
              id="codeField"
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <LanguageSelect handleSelectLanguage={handleSelectLanguage} />
            <Button
              type="submit"
              fontSize="0.9rem"
              backgroundColor="blue.primary"
              mt="1.5rem"
              color="#FFF"
            >
              {writeMode === 'add' ? 'Add Comment' : 'Edit Comment'}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default CommentForm;
