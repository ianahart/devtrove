import { Box, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import PostPicture from '../Posts/PostPicture';
import { ISearchResultProps } from '../../interfaces/props';
const SearchResult = ({ result }: ISearchResultProps) => {
  return (
    <Box px="0.5rem" _hover={{ bg: 'rgba(246, 56,220,0.2)' }} my="0.5rem">
      <Link as={RouterLink} to={`/${result.id}${result.slug}`}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width={['100%', '400px', '400px']}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            width="65px"
            height="65px"
            boxShadow="lg"
          >
            <PostPicture coverImage={result.cover_image} author={result.author} />
          </Box>
          <Box ml="auto">
            <Text color="#FFF" fontSize="1.1rem" fontWeight="bold">
              {result.title}
            </Text>
          </Box>
        </Box>
        <Text fontSize="0.9rem" textAlign="left" color="purple.tertiary">
          Written by: {result.author}
        </Text>
      </Link>
    </Box>
  );
};

export default SearchResult;
