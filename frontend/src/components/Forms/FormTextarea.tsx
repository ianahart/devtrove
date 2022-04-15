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

const FormTextarea = ({
  label,
  name,
  id,
  active = false,
  error = '',
  value,
  captureInput,
}: IFormTextareaProps) => {
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
        <FormLabel color="#FFF" htmlFor={name}>
          {label}
        </FormLabel>
      </Box>
      <Textarea
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
