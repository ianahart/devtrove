import { Box, Button, Heading, Link, Text } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/global';
import { IGlobalContext, ILoginForm } from '../../interfaces';
import { ILoginRequest } from '../../interfaces/requests';
import EntryInput from './EntryInput';

const LoginForm: React.FC = () => {
  const initialForm = {
    email: { name: 'email', value: '', error: '' },
    password: { name: 'password', value: '', error: '' },
  };
  const navigate = useNavigate();
  const { closeModal, stowTokens } = useContext(GlobalContext) as IGlobalContext;
  const [form, setForm] = useState<ILoginForm>(initialForm);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      navigate('/');
    }
  }, [isLoaded, navigate]);

  const captureInput = (name: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ILoginForm], value },
    }));
  };

  const validate = () => {
    const submitted = Object.assign({}, form);
    for (const [key, field] of Object.entries(submitted)) {
      const name = field.name.charAt(0).toUpperCase() + field.name.slice(1).toLowerCase();
      field.error = !field.value.trim().length ? `Please fill in ${name} field.` : '';
    }
    setForm(submitted);
  };

  const errors = () => {
    return Object.entries(Object.assign({}, form))
      .map(([key, field]) => field.error)
      .filter((field) => field.length);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      validate();
      if (errors().length) {
        return;
      }

      const response = await axios.post<ILoginRequest>('/api/v1/auth/login/', {
        email: form.email.value,
        password: form.password.value,
      });
      if (response.status === 200) {
        stowTokens(response.data.tokens, response.data.user);
        setIsLoaded(true);
        closeModal();
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setFormError(e.response?.data);
      }
    }
  };

  const setFormError = <IAxiosError extends unknown>(errors: IAxiosError) => {
    for (let error in errors) {
      setForm((prevState) => ({
        ...prevState,
        [error]: { ...prevState[error as keyof ILoginForm], error: errors[error] },
      }));
    }
  };

  return (
    <form onSubmit={handleOnSubmit} style={{ width: '100%' }}>
      <Box mt="-5rem">
        <Heading color="#FFF" textAlign="center" as="h3">
          Login
        </Heading>
        <Box
          mt="0.5rem"
          mb="2rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="#FFF" mr="0.25rem">
            New To DevTrove?
          </Text>
          <Link color="purple.primary" to="/register" as={RouterLink}>
            <Box onClick={closeModal} as="span">
              Sign up for an account
            </Box>
            .
          </Link>
        </Box>
      </Box>
      {errors().map((error: string, index: number) => {
        return (
          <Text key={index} textAlign="center" color="purple.secondary">
            {error}
          </Text>
        );
      })}
      <EntryInput
        id={form.email.name}
        name={form.email.name}
        label="Email"
        error={form.email.error}
        value={form.email.value}
        type="email"
        captureInput={captureInput}
      />
      <EntryInput
        id={form.password.name}
        name={form.password.name}
        label="Password:"
        error={form.password.error}
        value={form.password.value}
        type="password"
        captureInput={captureInput}
      />

      <Box mt="2rem" display="flex" justifyContent="center">
        <Button type="submit" variant="entryButton">
          Login
        </Button>
      </Box>
    </form>
  );
};

export default LoginForm;
