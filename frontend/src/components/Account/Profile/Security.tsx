import { Box, Heading, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import PasswordForm from '../../Forms/PasswordForm';
import { IPasswordForm } from '../../../interfaces/';
import { GlobalContext } from '../../../context/global';
import { IGlobalContext, IPostsContext } from '../../../interfaces/';
import { PostsContext } from '../../../context/posts';
import { http } from '../../../helpers';
import { nanoid } from 'nanoid';

const Security = () => {
  const navigate = useNavigate();
  const { clearPosts, setIsLoaded } = useContext(PostsContext) as IPostsContext;

  const { theme, logout, userAuth, setTheme, setIsSearchOpen } = useContext(
    GlobalContext
  ) as IGlobalContext;
  const [responseError, setResponseError] = useState<Array<string>>([]);
  const [form, setForm] = useState<IPasswordForm>({
    newpassword: { name: 'newpassword', value: '', error: '' },
    confirmpassword: { name: 'confirmpassword', value: '', error: '' },
  });

  const captureInput = (name: string, val: string) => {
    const key = name as keyof IPasswordForm;
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[key], value: val },
    }));
  };

  const validate = () => {
    resetFormForValidation();
    setResponseError([]);
    const error = 'Please make sure to fill out the field above.';
    for (const [key, field] of Object.entries(form)) {
      if (field.value.trim().length === 0) {
        setForm((prevState) => ({
          ...prevState,
          [key]: { ...prevState[key as keyof IPasswordForm], error },
        }));
      }
    }
  };

  const checkForErrors = () => {
    const errors = Object.entries({ ...form })
      .map((field) => field[1]['value'])
      .filter((field) => field.length);

    return errors.length === Object.keys(form).length ? false : true;
  };
  const resetFormForValidation = () => {
    const cleared = Object.entries({ ...form }).map((field) => {
      return { [field[0]]: { ...field[1], error: '' } };
    });
    const resetForm = { ...form };
    for (const field of Object.entries(cleared)) {
      const [prop, val] = Object.entries(field[1])[0];
      const key = prop as keyof IPasswordForm;
      resetForm[key] = { ...val, error: '' };
    }
    setForm(resetForm);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validate();
    if (!checkForErrors()) {
      await changePassword();
    }
  };

  const changePassword = async () => {
    try {
      const response = await http.patch(`/auth/${userAuth.user.id}/change-password/`, {
        password: form.newpassword.value,
        confirmpassword: form.confirmpassword.value,
        refresh_token: userAuth.refresh_token,
      });
      if (response.status === 200) {
        logout();
        navigate('/login');
        clearPosts();
        setTheme('dark');
        setIsLoaded(false);
        setIsSearchOpen(false);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          applyResponseErrors(e.response?.data.error);
        }
      }
    }
  };

  function applyResponseErrors<T extends Array<string>>(errors: T) {
    for (const error of Object.entries(errors)) {
      const [key, value] = error;
      setResponseError((prevState: string[]) => [...prevState, ...value]);
    }
  }
  return (
    <Box p="0.5rem">
      <Heading
        p="0.5rem"
        as="h3"
        color={theme === 'dark' ? '#FFF' : '#000'}
        fontSize="24px"
      >
        Password & Security
      </Heading>
      <Text color="text.primary" fontSize="0.9rem">
        You will be logged out and asked to login with your new password.
      </Text>
      {responseError.length > 0 &&
        responseError.map((error) => {
          return (
            <Text key={nanoid()} mt="2rem" color="purple.secondary">
              {error}
            </Text>
          );
        })}
      <Box maxW="750px" m="3rem auto 2rem auto">
        <PasswordForm
          captureInput={captureInput}
          form={form}
          handleOnSubmit={handleOnSubmit}
          btnText="Change Password"
        />
      </Box>
    </Box>
  );
};

export default Security;
