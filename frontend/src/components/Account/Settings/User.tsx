import { Box, Heading, Icon, Switch, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { BsMoonStars, BsSun, BsPalette } from 'react-icons/bs';
import axios, { AxiosError } from 'axios';
import { IGlobalContext } from '../../../interfaces';
import { IUpdateSettingRequest } from '../../../interfaces/requests';
import { GlobalContext } from '../../../context/global';
import { http } from '../../../helpers';

const User = (): JSX.Element => {
  const { setTheme, theme, userAuth, updateSetting } = useContext(
    GlobalContext
  ) as IGlobalContext;
  const [error, setError] = useState('');
  const handleSwitch = async () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      const response = await http.patch<IUpdateSettingRequest>(
        `/settings/${userAuth.user.setting_id}/`,
        {
          data: { theme: newTheme, user: userAuth.user.id },
        }
      );
      updateSetting(response.data);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        setError(e.response?.data.error);
      }
    }
  };

  return (
    <Box p="0.5rem">
      <Heading
        p="0.5rem"
        as="h3"
        fontSize="24px"
        color={theme === 'dark' ? '#FFF' : '#000'}
      >
        User Settings
      </Heading>
      <Box my="2rem">
        <Heading
          alignItems="center"
          display="flex"
          fontSize="1.4rem"
          as="h4"
          color={theme === 'dark' ? '#FFF' : '#000'}
        >
          Appearance{' '}
          <Icon
            ml="0.65rem"
            as={BsPalette}
            color={theme === 'dark' ? '#FFF' : '#000'}
            fontSize="22px"
          />
        </Heading>
        <Box my="1rem">
          <Text color="text.primary">Toggle between light and dark theme</Text>
        </Box>
        <Box alignItems="center" display="flex">
          <Switch
            defaultChecked
            value={theme}
            onChange={handleSwitch}
            colorScheme="pink"
            size="lg"
          />
          <Icon
            ml="1rem"
            as={theme === 'dark' ? BsMoonStars : BsSun}
            color={theme === 'dark' ? '#FFF' : '#000'}
            fontSize="18px"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default User;
