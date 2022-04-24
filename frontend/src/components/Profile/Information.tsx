import { Box, Heading, Icon, Link, Text } from '@chakra-ui/react';
import { IFullUser, ILanguage } from '../../interfaces/index';
import { useContext } from 'react';
import { IGlobalContext } from '../../interfaces/';
import { GlobalContext } from '../../context/global';
import { AiOutlineLink, AiFillGithub, AiFillTwitterCircle } from 'react-icons/ai';
interface IInformationProps<T> {
  profile: IFullUser<T>;
}

const Information = ({ profile }: IInformationProps<object>) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box width="100%" my="2rem" p="0.5rem">
      <Heading as="h3" fontSize="18px" color={theme === 'dark' ? '#FFF' : '#000'}>
        Account Details
      </Heading>
      <Text mt="0.5rem" color="purple.tertiary">
        Basic information below.
      </Text>
      <Box className="profile-field-container" display="flex" flexDir="column">
        <Text p="0.2rem" color={theme === 'dark' ? '#FFF' : '#000'}>
          Name:{' '}
          <Box as="span" fontWeight="bold">
            {profile.first_name} {profile.last_name}
          </Box>
        </Text>
      </Box>

      <Box className="profile-field-container" display="flex" flexDir="column">
        <Text p="0.2rem" color="#FFF">
          Company{' '}
          <Box as="span" fontWeight="bold">
            {profile.company}
          </Box>
        </Text>
      </Box>

      <Box className="profile-field-container" display="flex" flexDir="column">
        <Text p="0.2rem" color="#FFF">
          Job Title:{' '}
          <Box as="span" fontWeight="bold">
            {profile.job_title}
          </Box>
        </Text>
      </Box>

      <Box
        className="profile-field-container"
        width="70%"
        display="flex"
        flexDir="column"
      >
        <Text p="0.2rem" color="#FFF">
          Bio:{' '}
          <Box as="span" fontWeight="bold">
            {profile.bio}
          </Box>
        </Text>
      </Box>
      <Box
        width="70%"
        className="profile-field-container"
        display="flex"
        flexDir="column"
      >
        <Box display="flex" alignItems="center">
          <Icon fontSize="24px" mr="1rem" as={AiFillGithub} color="#FFF" />
          <Link href={profile.github}>
            <Text color="purple.secondary" fontWeight="bold">
              {profile.github}
            </Text>
          </Link>
        </Box>
      </Box>
      <Box className="profile-field-container" display="flex" flexDir="column">
        <Box display="flex" alignItems="center">
          <Icon fontSize="24px" mr="1rem" as={AiFillTwitterCircle} color="#FFF" />
          <Text color="purple.secondary" fontWeight="bold">
            {profile.twitter}
          </Text>
        </Box>
      </Box>
      <Box className="profile-field-container" display="flex" flexDir="column">
        <Box display="flex" alignItems="center">
          <Icon fontSize="24px" mr="1rem" as={AiOutlineLink} color="#FFF" />
          <Link href={profile.website}>
            <Text color="purple.secondary" fontWeight="bold">
              {profile.website}
            </Text>
          </Link>
        </Box>
      </Box>
      <Box mt="2rem">
        <Text mb="1rem" color={theme === 'dark' ? '#FFF' : '#000'}>
          Languages:
        </Text>
        <Box width="90%" flex="wrap" display="flex">
          {profile.languages.map((language: ILanguage) => {
            return (
              <Box
                my="0.5rem"
                width="90%"
                key={language.id}
                display="flex"
                alignItems="center"
              >
                <Box mr="1rem" as="i" fontSize="24px" className={language.snippet}></Box>
                <Text color={theme === 'dark' ? '#FFF' : '#000'} fontSize="0.9rem">
                  {language.name}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Information;
