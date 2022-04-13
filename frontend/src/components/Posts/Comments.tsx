import { Box, Button, Text } from '@chakra-ui/react';
import Comment from './Comment';
import { IComment, IPost } from '../../interfaces';
import Actions from './Actions';
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
  return (
    <Box>
      <Box py="0.5rem" fontSize="1rem" display="flex" alignItems="center">
        <Text mx="0.5rem">122 Upvotes</Text>
        <Text mx="0.5rem">16 Comments</Text>
      </Box>
      <Box width="300px" margin="0 auto">
        {post ? <Actions id={post.id} slug={post.slug} /> : <Box></Box>}
      </Box>

      <Box>
        <Text color="#FFF">Comments</Text>
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
      <Box display="flex" justifyContent="center" py="1.3rem" my="1rem">
        <Button
          disabled={commentsLoaded}
          onClick={handlePagination}
          variant="entryButton"
        >
          More comments...
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
