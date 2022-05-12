import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  FormErrorMessage,
  Icon,
} from '@chakra-ui/react';
import { GiPirateHook } from 'react-icons/gi';
import { IFormTextareaProps } from '../../interfaces/props';
import { useContext } from 'react';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces/';
const FormTextarea = ({
  label,
  name,
  id,
  active = false,
  error = '',
  value,
  captureInput,
}: IFormTextareaProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    captureInput(name, value);
  };

  return (
    <FormControl mb="1rem" isInvalid={!!error.length && active}>
      <Box display="flex" alignItems="center">
        {error.length > 0 && (
          <Icon mb={2} mr="0.25rem" as={GiPirateHook} height="30px" color="red" />
        )}
        <FormLabel color={theme === 'dark' ? '#FFF' : '#000'} htmlFor={name}>
          {label}
        </FormLabel>
      </Box>
      <Textarea
        bg={theme === 'dark' ? '#000' : '#FFF'}
        color={theme === 'dark' ? '#FFF' : '#000'}
        variant="primaryTextarea"
        onChange={handleOnChange}
        value={value}
        name={name}
        autoComplete="off"
        id={id}
      />
      {error.length > 0 && (
        <FormErrorMessage color="purple.secondary">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormTextarea;
