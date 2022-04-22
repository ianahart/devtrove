import { Box, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { IFullUser } from '../../interfaces';
import ProfilePicture from '../Account/ProfilePicture';
import Stats from '../Profile/Stats';
import Information from '../Profile/Information';

interface IMainProps {
  profile: IFullUser<object>;
}

const Main = ({ profile }: IMainProps) => {
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
              <Heading as="h3" color="#FFF" fontSize="22px">
                Name not specified
              </Heading>
            ) : (
              <Heading as="h3" color="#FFF" fontSize="28px">
                {profile.first_name} {profile.last_name}
              </Heading>
            )}
            <Text mt="1rem" color="#FFF">
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
            color={activeChild === 'stats' ? '#C42CB0' : '#FFF'}
            onClick={() => handleOnClick('stats')}
            cursor="pointer"
            fontWeight="bold"
          >
            Stats
          </Text>
          <Text
            color={activeChild === 'information' ? '#C42CB0' : '#FFF'}
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
          <Stats countTags={profile.count_tags} />
        ) : (
          <Information profile={profile} />
        )}
      </Box>
    </Box>
  );
};

export default Main;
