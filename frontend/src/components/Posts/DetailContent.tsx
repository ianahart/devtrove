import { useContext } from 'react';
import { Box, Heading, Icon, Image, Link, Text } from '@chakra-ui/react';
import { AiOutlinePicture } from 'react-icons/ai';
import { IGlobalContext } from '../../interfaces/';
import { GlobalContext } from '../../context/global';
import { IPostProps } from '../../interfaces/props';
import Logo from '../Mixed/Logo';
import Tags from './Tags';

const DetailContent = ({ post }: IPostProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <>
      {post === undefined ? (
        <></>
      ) : (
        <Box
          minH="640px"
          margin="0 auto"
          borderTopWidth="unset"
          borderTopColor="transparent"
          padding="0.5rem"
          width={['100%', '90%', '640px']}
        >
          <Box my="1.5rem">
            {post?.cover_image !== '[]' ? (
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
            {post.logo ? (
              <Image src={post.logo} alt={post.title} />
            ) : (
              <Logo
                height="30px"
                width="30px"
                fontSize="16px"
                textOne="Dev"
                textTwo="Trove"
              />
            )}
          </Box>
          <Box m="2rem auto 1.5rem auto" textAlign="center">
            <Heading
              fontSize="1.75rem"
              color={theme === 'dark' ? '#FFF' : '#000'}
              as="h2"
            >
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
              textShadow={theme === 'dark' ? '4px 3px 0px #000' : '0px 0px 0px'}
              fontWeight="900"
              width="100%"
              fontSize="1.1rem"
              color="purple.secondary"
              boxShadow="lg"
            >
              Snippet
            </Text>
          </Box>
          <Box color={theme === 'dark' ? '#FFF' : '#000'} mb="2rem">
            <Text>{post.snippet}</Text>
          </Box>
          <Box my="2rem">
            <Link
              color="purple.secondary"
              href={
                post.type !== null
                  ? `/devtrove-post/${post.id}/${post.slug}`
                  : post.details_url
              }
            >
              Read full article...
            </Link>
          </Box>
          <Box mb="2rem">
            <Tags tags={post.tags} />
          </Box>
        </Box>
      )}
    </>
  );
};
export default DetailContent;
