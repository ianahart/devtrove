import { Box, Button, Text, FormControl, Icon, Input } from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import axios, { AxiosError } from 'axios';
import { ISearchPostRequest } from '../../interfaces/requests';
import { http } from '../../helpers';
import { ISearchResult } from '../../interfaces';
import SearchResult from './SearchResult';
import { IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';

const Search = () => {
  const { isSearchOpen } = useContext(GlobalContext) as IGlobalContext;
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [searches, setSearches] = useState<ISearchResult[]>([]);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, has_next_page: false });

  const searchPosts = useCallback(
    async (search_term: string) => {
      try {
        setSearches([]);
        setInputValue(search_term);
        if (search_term.trim().length === 0) return;
        const response = await http.post<ISearchPostRequest>('/posts/search/', {
          search_term,
          page: pagination.page,
        });
        setSearches((prevState) => [...prevState, ...response.data.search_results]);
        setPagination(response.data.pagination);
      } catch (e: unknown | AxiosError) {
        if (axios.isAxiosError(e)) {
          if (e.response?.status === 400 && e.response?.data.error !== 'no results') {
            setError(e.response?.data.error.search_term[0]);
            return;
          }
          if (e.response?.data.error === 'no results') {
            setError(`Could not find any results.`);
            setPagination(e.response?.data.pagination);
            setDropdown(false);
          }
        }
      }
    },
    [pagination.page]
  );
  const closeOnClickAway = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!dropdownRef.current?.contains(target)) {
      setDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', closeOnClickAway);
    return () => window.removeEventListener('click', closeOnClickAway);
  }, []);

  useEffect(() => {
    if (inputValue.trim().length === 0) {
      setDropdown(false);
      setSearches([]);
      setPagination({ page: 1, has_next_page: false });
    }
  }, [inputValue]);

  useEffect(() => {
    if (!isSearchOpen) {
      setInputValue('');
      setSearches([]);
      setError('');
      setPagination({ page: 1, has_next_page: false });
    }
  }, [isSearchOpen]);
  const debounced = useMemo(
    () => debounce((search_term: string) => searchPosts(search_term), 300),
    [searchPosts]
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setDropdown(true);
    if (debounced) {
      setError('');
      debounced(e.target.value);
    }
  };

  return (
    <Box>
      {isSearchOpen && (
        <Box className="search-input" position="relative" margin="3rem auto 2rem auto">
          <form>
            <Text textAlign="left" mb="0.5rem" color="purple.secondary">
              {error}
            </Text>
            <FormControl position="relative">
              <Input
                pl="2rem"
                onChange={handleOnChange}
                placeholder="Search for articles..."
                variant="inputEntry"
                value={inputValue}
                type="text"
                name="search"
                id="search"
                autoComplete="off"
              />
              <Icon
                left="1"
                top="2"
                as={BsSearch}
                position="absolute"
                fontSize="24px"
                color="purple.secondary"
              />
            </FormControl>
          </form>
          {dropdown && (
            <Box
              ref={dropdownRef}
              className="search-dropdown"
              borderRadius="8px"
              width="100%"
              minH="200px"
              height="200px"
              overflowY="auto"
              boxShadow="lg"
              bg="rgba(0, 0, 0, 0.9)"
              margin="0 auto"
            >
              {searches.map((search) => {
                return <SearchResult key={search.id} result={search} />;
              })}
              {pagination.has_next_page && (
                <Button
                  onClick={() => searchPosts(inputValue)}
                  _hover={{ bg: 'transparent', outline: 'none' }}
                  variant="inputEntry"
                  color="purple.secondary"
                  border="none"
                  bg="transparent"
                >
                  See more...
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Search;
