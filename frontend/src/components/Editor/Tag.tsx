import { Box, Icon, Text } from '@chakra-ui/react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CreateTag } from '../../interfaces';
interface ITagProps {
  editorTag: CreateTag;
  removeTag: (id: string) => void;
}
const Tag = ({ editorTag, removeTag }: ITagProps) => {
  return (
    <Box
      m="0.3rem"
      borderRadius="20px"
      p="0.1rem 0.25rem"
      borderColor="text.secondary"
      position="relative"
      borderWidth="1px"
      borderStyle="solid"
    >
      <Icon
        cursor="pointer"
        onClick={() => removeTag(editorTag.id)}
        as={AiOutlineCloseCircle}
        position="absolute"
        top="-7px"
        right="-10px"
        fontSize="20px"
        color="purple.secondary"
      />
      <Text px="0.5rem">{editorTag.tag}</Text>
    </Box>
  );
};

export default Tag;
