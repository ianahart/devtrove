import { Box, Heading, Switch, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { http } from '../../../helpers';
import { IGlobalContext } from '../../../interfaces';
import { GlobalContext } from '../../../context/global';
const General = () => {
  const { theme, userAuth, updateSetting, updatePreferredLanguage } = useContext(
    GlobalContext
  ) as IGlobalContext;
  const [error, setError] = useState('');

  const handleSwitch = async () => {
    try {
      const response = await http.patch(
        `/settings/language/${userAuth.user.setting_id}/`,
        {
          preferred_language: !userAuth.user.preferred_language,
        }
      );

      updatePreferredLanguage(!userAuth.user.preferred_language, 'preferred_language');
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        setError(e.response?.data.error);
      }
    }
  };
  return (
    <Box p="0.5rem" mt="2rem">
      <Heading
        alignItems="center"
        display="flex"
        fontSize="1.4rem"
        as="h4"
        color={theme === 'dark' ? '#FFF' : '#000'}
      >
        Preffered Languages{' '}
      </Heading>
      <Box my="1rem">
        <Text color="text.primary">
          Curate posts on the homepage by the languages you set in your profile.
        </Text>
      </Box>

      <Switch
        isChecked={userAuth.user.preferred_language}
        onChange={handleSwitch}
        colorScheme="pink"
        size="lg"
      />
    </Box>
  );
};

export default General;
