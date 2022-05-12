import { Button, Box, Icon, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { GlobalContext } from '../../context/global';
import { IFormField, IGlobalContext, IPasswordForm } from '../../interfaces/';
import FormInput from './FormInput';
interface IPasswordFormProps {
  btnText: string;
  handleOnSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  form: IPasswordForm;
  captureInput: (n: string, v: string) => void;
  extraField: boolean;
  oldPassword: IFormField;
}

const PasswordForm = ({
  form,
  oldPassword,
  extraField,
  captureInput,
  handleOnSubmit,
  btnText,
}: IPasswordFormProps): JSX.Element => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Box position="relative">
        <Box mb="2rem" display="flex" alignItems="center">
          <Icon
            onClick={togglePasswordVisibility}
            mr="1rem"
            fontSize="22px"
            cursor="pointer"
            left="120px"
            color={theme === 'dark' ? '#FFF' : '#000'}
            as={passwordVisible ? AiOutlineEye : AiOutlineEyeInvisible}
          />
          <Text color="purple.tertiary" fontSize="0.85rem">
            Toggle password visibility
          </Text>
        </Box>

        {extraField && (
          <Box my="2.5rem">
            <FormInput
              captureInput={captureInput}
              value={oldPassword.value}
              error={oldPassword.error}
              active={true}
              name="oldpassword"
              label="Old Password:"
              type={passwordVisible ? 'text' : 'password'}
            />
          </Box>
        )}
        <Box my="2.5rem">
          <FormInput
            captureInput={captureInput}
            value={form.newpassword.value}
            error={form.newpassword.error}
            active={true}
            name="newpassword"
            label="New Password"
            type={passwordVisible ? 'text' : 'password'}
          />
        </Box>
      </Box>
      <Text fontSize="0.9rem" mt="0" mb="1rem" color="purple.tertiary">
        Rember a password must include 1 special character, 1 digit, 1 lower and 1
        uppercase letter.
      </Text>
      <Box my="2.5rem">
        <FormInput
          captureInput={captureInput}
          value={form.confirmpassword.value}
          error={form.confirmpassword.error}
          active={true}
          name="confirmpassword"
          label="Confirm Password"
          type={passwordVisible ? 'text' : 'password'}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" my="2rem">
        <Button type="submit" variant="secondaryButton">
          {btnText}
        </Button>
      </Box>
    </form>
  );
};

export default PasswordForm;
