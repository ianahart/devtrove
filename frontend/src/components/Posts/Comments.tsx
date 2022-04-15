import { Box, Button, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import Comment from './Comment';
import { GlobalContext } from '../../context/global';
import { IComment, IPost, IGlobalContext } from '../../interfaces';
import Actions from './Actions';
import ProfilePicture from '../Account/ProfilePicture';
interface ICommentProps {
  post: IPost;
  commentsLoaded: boolean;
  comments: IComment[];
  handlePagination: () => void;
  handleCommentOperation: () => void;
}
const Comments = ({
  post,
  comments,
  commentsLoaded,

  handleCommentOperation,
  handlePagination,
}: ICommentProps) => {
  const { openModal, userAuth } = useContext(GlobalContext) as IGlobalContext;
  const commentModalText = comments.length
    ? 'Add to the discussion'
    : 'Start a discussion';
  return (
    <Box>
      {post && (
        <Box py="0.5rem" fontSize="1rem" display="flex" alignItems="center">
          <Text mx="0.5rem">{post.comments_count} Comments</Text>
        </Box>
      )}
      <Box width="300px" margin="0 auto">
        {post ? (
          <Actions
            cur_user_voted={post.cur_user_voted}
            upvotes_count={post.upvotes_count}
            comments_count={post.comments_count}
            id={post.id}
            slug={post.slug}
          />
        ) : (
          <Box></Box>
        )}
      </Box>

      <Box>
        {comments.map((comment) => {
          return (
            <Comment
              handleCommentOperation={handleCommentOperation}
              key={comment.id}
              comment={comment}
            />
          );
        })}
      </Box>
      <Box display="flex" alignItems="center" mt="1.2rem" onClick={openModal}>
        <ProfilePicture
          avatar_url={userAuth.user.avatar_url}
          height="40px"
          width="40px"
        />
        <Box
          mb="1rem"
          cursor="pointer"
          textAlign="left"
          bg="#2a2c2a"
          borderRadius="20px"
          padding="0.5rem"
          width={['100%', '100%', '400px']}
          ml="1.5rem"
        >
          <Text>{commentModalText}</Text>
        </Box>
      </Box>
      {!commentsLoaded && (
        <Box display="flex" justifyContent="center" py="1.3rem" my="1rem">
          <Button
            disabled={commentsLoaded}
            onClick={handlePagination}
            variant="entryButton"
          >
            More comments...
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Comments;
