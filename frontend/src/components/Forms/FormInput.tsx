import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Icon,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { GiPirateHook } from 'react-icons/gi';
import { IFormInputProps } from '../../interfaces/props';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
const FormInput = ({
  label,
  name,
  id,
  type,
  helperText = '',
  active = false,
  error = '',
  value,
  captureInput,
}: IFormInputProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <Input
        onChange={handleOnChange}
        value={value}
        name={name}
        color={theme === 'dark' ? '#FFF' : '#000'}
        autoComplete="off"
        variant="inputEntry"
        id={id}
        type={type}
      />
      {helperText.length > 0 && <FormHelperText>{helperText}</FormHelperText>}
      {error.length > 0 && (
        <FormErrorMessage color="purple.secondary">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormInput;
