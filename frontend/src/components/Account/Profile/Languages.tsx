import { Box, Icon, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { devIcons } from '../../../helpers/index';
import { DevIcon } from '../../../types';

type LanguageCrud = (icon: DevIcon) => void;

interface ILanguageProps {
  addLanguage: LanguageCrud;
  removeLanguage: LanguageCrud;

  myIcons: DevIcon[];
}

const Languages = ({ myIcons, addLanguage, removeLanguage }: ILanguageProps) => {
  const [icons, setIcons] = useState(devIcons);

  const handleAddLanguage = (selected: DevIcon) => {
    const filteredIcons = [...icons].filter((icon) => icon.id !== selected.id);
    setIcons(filteredIcons);
    addLanguage(selected);
  };

  const handleRemoveLanguage = (selected: DevIcon) => {
    removeLanguage(selected);
    setIcons([...icons, selected]);
  };

  return (
    <>
      <Text color="#FFF">Technologies:</Text>
      {myIcons.length <= 0 ? (
        <Text textAlign="center" color="purple.primary">
          Select Languages to show on your profile.
        </Text>
      ) : (
        <Box
          display="flex"
          borderColor="purple.primary"
          flex="wrap"
          layerStyle="userIconContainer"
        >
          {myIcons.map((icon) => {
            return (
              <Box
                position="relative"
                borderStyle="solid"
                borderWidth="1px"
                borderRadius="8px"
                borderColor="#000"
                m="1rem 0.5rem 1rem 0.5rem"
                minWidth="50px"
                padding="3px"
                display="flex"
                alignItems="center"
                flexDir="column"
                key={icon.id}
              >
                <Box
                  cursor="pointer"
                  as="i"
                  fontSize="24px"
                  className={icon.snippet}
                ></Box>
                <Text color="#FFF" fontSize="12px">
                  {icon.name}
                </Text>
                <Icon
                  onClick={() => handleRemoveLanguage(icon)}
                  cursor="pointer"
                  position="absolute"
                  top="-5px"
                  right="-5px"
                  color="#FFF"
                  fontSize="16px"
                  as={AiOutlineCloseCircle}
                />
              </Box>
            );
          })}
        </Box>
      )}

      <Box layerStyle="userIconContainer" borderColor="#000" mt="3rem">
        {icons.map((icon) => {
          return (
            <Box
              onClick={() => handleAddLanguage(icon)}
              cursor="pointer"
              display="inline-block"
              mx="1rem"
              my="0.5rem"
              key={icon.id}
              as="i"
              fontSize="24px"
              className={icon.snippet}
            ></Box>
          );
        })}
      </Box>
    </>
  );
};

export default Languages;
