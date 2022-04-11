import { Box, Heading, Icon, Image, Link, Text } from '@chakra-ui/react';
import { FaDev } from 'react-icons/fa';
import { AiOutlinePicture } from 'react-icons/ai';
import { IPostProps } from '../../interfaces';
import Actions from './Actions';
import Tags from './Tags';
const DetailContent = ({ post }: IPostProps) => {
  return (
    <>
      {post === null ? (
        <></>
      ) : (
        <Box
          minH="640px"
          margin="0 auto"
          minHeight="100vh"
          border="1px solid #403d40"
          borderTopColor="transparent"
          padding="0.5rem"
          width={['100%', '90%', '640px']}
        >
          <Box my="1.5rem">
            {post.cover_image !== '[]' ? (
              <Image src={post.cover_image} alt={post.author} />
            ) : (
              <Icon
                as={AiOutlinePicture}
                height="120px"
                width="100%"
                color="purple.secondary"
              />
            )}
          </Box>
          <Box alignItems="center" display="flex">
            <Icon fontSize="40px" as={FaDev} />
            <Text alignSelf="flex-end" fontSize="1.2rem" mx="1rem">
              DevTo
            </Text>
          </Box>
          <Box m="2rem auto 1.5rem auto" textAlign="center">
            <Heading fontSize="1.75rem" as="h2">
              {post.title}
            </Heading>
          </Box>
          <Box alignItems="center" display="flex">
            <Text color="text.primary" fontSize="0.9rem">
              {post.published_date}
            </Text>
            <Box mx="1rem" color="text.primary" as="span">
              &#124;
            </Box>
            <Text color="text.primary" fontSize="0.9rem">
              {post.min_to_read}
            </Text>
          </Box>
          <Box textAlign="left" width="100px" m="2rem 0 0.75rem 0">
            <Text
              textShadow="4px 3px 0px #000"
              fontWeight="900"
              width="100%"
              fontSize="1.1rem"
              color="purple.secondary"
              boxShadow="lg"
            >
              Snippet
            </Text>
          </Box>
          <Box color="#FFF" mb="2rem">
            <Text>{post.snippet}</Text>
          </Box>
          <Box my="2rem">
            <Link color="purple.secondary" href={post.details_url}>
              Read full article...
            </Link>
          </Box>
          <Box mb="2rem">
            <Tags post={post} />
          </Box>
          <Box bg="text.secondary" height="1px" width="100%" m="auto auto 0 auto"></Box>
          <Box py="0.5rem" fontSize="1rem" display="flex" alignItems="center">
            <Text mx="0.5rem">122 Upvotes</Text>
            <Text mx="0.5rem">16 Comments</Text>
          </Box>
          <Box width="300px" margin="0 auto">
            <Actions id={post.id} slug={post.slug} />
          </Box>
          <Box bg="text.secondary" height="1px" width="100%" m="auto auto 0 auto"></Box>
        </Box>
      )}
    </>
  );
};
export default DetailContent;
