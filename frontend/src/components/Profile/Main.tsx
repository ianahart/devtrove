import { Box, Heading, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { IFullUser, IGlobalContext } from '../../interfaces';
import { GlobalContext } from '../../context/global';
import ProfilePicture from '../Account/ProfilePicture';
import Stats from '../Profile/Stats';
import Information from '../Profile/Information';

interface IMainProps {
  profile: IFullUser<object>;
}

const Main = ({ profile }: IMainProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const [activeChild, setActiveChild] = useState('stats');
  const handleOnClick = (child: string) => {
    setActiveChild(child);
  };

  return (
    <Box padding="1rem" borderRight="1px solid #403d40" borderLeft="1px solid #403d40">
      <Box borderBottom="1px solid #403d40" p="3rem 0.5rem 0.5rem 0.5rem">
        <Box display="flex">
          <Box p="0.5rem" bg="#212122" borderRadius="20px">
            <Box>
              <ProfilePicture
                borderRadius="10%"
                width="100px"
                height="100px"
                avatar_url={profile.avatar_url}
              />
            </Box>
          </Box>
          <Box ml="2.5rem" display="flex" flexDir="column">
            {!profile.first_name || !profile.last_name ? (
              <Heading as="h3" color={theme === 'dark' ? '#FFF' : '#000'} fontSize="22px">
                Name not specified
              </Heading>
            ) : (
              <Heading as="h3" color={theme === 'dark' ? '#FFF' : '#000'} fontSize="28px">
                {profile.first_name} {profile.last_name}
              </Heading>
            )}
            <Text mt="1rem" color={theme === 'dark' ? '#FFF' : '#000'}>
              @{profile.handle}
            </Text>
            <Text fontSize="14px" mt="1.5rem" color="text.primary">
              Joined {profile.joined}
            </Text>
          </Box>
        </Box>
        <Box justifyContent="space-between" width="250px" mt="4rem" display="flex">
          <Text
            className="hvr-wobble-vertical"
            color={
              activeChild === 'stats' ? '#C42CB0' : theme === 'dark' ? '#FFF' : '#000'
            }
            onClick={() => handleOnClick('stats')}
            cursor="pointer"
            fontWeight="bold"
          >
            Stats
          </Text>
          <Text
            color={
              activeChild === 'information'
                ? '#C42CB0'
                : theme === 'dark'
                ? '#FFF'
                : '#000'
            }
            className="hvr-wobble-vertical"
            onClick={() => handleOnClick('information')}
            cursor="pointer"
            fontWeight="bold"
          >
            Information
          </Text>
        </Box>
      </Box>
      <Box>
        {activeChild === 'stats' ? (
          <Stats
            dates={profile.dates}
            calendar={profile.calendar}
            articles_read={profile.articles_read}
            countTags={profile.count_tags}
          />
        ) : (
          <Information profile={profile} />
        )}
      </Box>
    </Box>
  );
};

export default Main;
