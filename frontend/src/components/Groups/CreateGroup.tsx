import { Box, Button, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import axios, { AxiosError } from 'axios';
import FormInput from '../Forms/FormInput';
import { GlobalContext } from '../../context/global';
import { IGroupsContext, IGlobalContext, ISearchResult } from '../../interfaces/';
import { http } from '../../helpers';
import { IGroupCreateRequest } from '../../interfaces/requests';
import { GroupsContext } from '../../context/groups';

type ID = number | null;
export interface IForm {
  name: { name: string; value: string; error: string; id: ID };
  title: { name: string; value: string; error: string; id: ID };
}

const CreateGroup = () => {
  const { groups, addGroup } = useContext(GroupsContext) as IGroupsContext;
  const { isSearchOpen, theme } = useContext(GlobalContext) as IGlobalContext;
  const [dropdown, setDropdown] = useState(false);
  const [searches, setSearches] = useState<ISearchResult[]>([]);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, has_next_page: false });
  const { closeModal } = useContext(GlobalContext) as IGlobalContext;

  const [form, setForm] = useState<IForm>({
    name: { name: 'name', value: '', error: '', id: null },
    title: { name: 'title', value: '', error: '', id: null },
  });

  const searchPosts = useCallback(
    async (searchTerm: string) => {
      try {
        setSearches([]);
        const response = await http.post('/posts/search/?page', {
          search_term: searchTerm,
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

  const debounced = useMemo(
    () => debounce((searchTerm: string) => searchPosts(searchTerm), 300),
    [searchPosts]
  );

  const setFormValue = (name: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof typeof form], value },
    }));
  };

  const captureInput = (name: string, value: string) => {
    setFormValue(name, value);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue(e.target.name, e.target.value);
    setSearches([]);
    setDropdown(true);
    setError('');
    if (debounced) {
      debounced(e.target.value);
    }
  };

  const resetTitle = () => {
    setForm((prevState) => ({
      ...prevState,
      title: { ...prevState['title'], value: '', id: null },
    }));
  };

  useEffect(() => {
    if (form.title.value.trim().length === 0) {
      setDropdown(false);
      setSearches([]);
      resetTitle();
      setPagination({ page: 1, has_next_page: false });
    }
  }, [form.title.value]);

  useEffect(() => {
    if (!isSearchOpen) {
      setSearches([]);
      resetTitle();
      setError('');
      setPagination({ page: 1, has_next_page: false });
    }
  }, [isSearchOpen]);

  const updateTitle = (value: string, id: number | null) => {
    setForm((prevState) => ({
      ...prevState,
      title: { ...prevState['title'], value, id },
    }));
    setDropdown(false);
  };

  const checkForErrors = () => {
    const values = Object.entries(Object.assign({}, form)).map((field) => field[1].value);
    return values.some((value) => value.length > 200) || form.title.value.length === 0
      ? true
      : false;
  };

  const handleCreateGroup = async () => {
    try {
      setError('');
      if (checkForErrors()) {
        setError('You have exceeded the character limit. Or you have an empty field.');
        return;
      }
      const response = await http.post<IGroupCreateRequest>('/groups/', {
        post: form.title.id,
        title: form.name.value,
      });
      addGroup(response.data.group);
      closeModal();
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.error);
      }
    }
  };

  return (
    <Box>
      <Box color={theme === 'dark' ? '#FFF' : '#000'} m="3rem auto 2rem auto">
        <Heading fontSize="20px" textAlign="center" as="h3">
          Create A Reading Group
        </Heading>
      </Box>
      <Box mt="5rem">
        {error.length > 0 && (
          <Text textAlign="center" fontSize="0.9rem" color="purple.secondary">
            {error}
          </Text>
        )}
        <Box mb="2rem">
          <FormInput
            id="title"
            type="text"
            active={true}
            value={form.name.value}
            captureInput={captureInput}
            error={form.name.error}
            label="Name of Group:"
            name="name"
          />
        </Box>
        <FormLabel color={theme === 'dark' ? '#FFF' : '#000'} htmlFor="title">
          Select Post:
        </FormLabel>
        <Input
          onChange={handleOnChange}
          variant="inputEntry"
          id="title"
          value={form.title.value}
          name="title"
        />
      </Box>
      {dropdown && searches.length > 0 && (
        <Box
          overflowY="auto"
          className="search-dropdown"
          margin="0 auto"
          border="1px solid"
          borderColor="purple.secondary"
          width="100%"
          height="150px"
        >
          {searches.map((search) => {
            return (
              <Box onClick={() => updateTitle(search.title, search.id)} key={search.id}>
                <Text cursor="pointer" color={theme === 'dark' ? '#FFF' : '#000'}>
                  {search.title}
                </Text>
              </Box>
            );
          })}
        </Box>
      )}
      <Box display="flex" justifyContent="center" mt="2rem">
        <Button onClick={handleCreateGroup} variant="entryButton" mx="0.5rem">
          Create
        </Button>
        <Button onClick={() => closeModal()} variant="secondaryButton" mx="0.5rem">
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default CreateGroup;
