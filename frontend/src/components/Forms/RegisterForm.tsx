import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { IGlobalContext, IRegisterForm } from '../../interfaces';
import { IRegisterRequest, IAxiosError } from '../../interfaces/requests';
import FormInput from './FormInput';
import { GlobalContext } from '../../context/global';
import { http } from '../../helpers';
const RegisterForm = (): JSX.Element => {
  const navigate = useNavigate();
  const initialForm = {
    email: { name: 'email', value: '', error: '' },
    username: { name: 'username', value: '', error: '' },
    password: { name: 'password', value: '', error: '' },
    confirmpassword: { name: 'confirmpassword', value: '', error: '' },
  };
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const [form, setForm] = useState<IRegisterForm>(initialForm);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      navigate('/');
    }
  }, [isLoaded, navigate]);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      validate();
      if (checkErrors()) {
        return;
      }

      const response = await http.post<IRegisterRequest>('auth/register/', {
        handle: form.username.value,
        email: form.email.value,
        password: form.password.value,
        confirmpassword: form.confirmpassword.value,
      });

      if (response.status === 201) {
        setIsLoaded(true);
      }
      setForm(initialForm);
    } catch (e: unknown | AxiosError) {
      setIsLoaded(false);
      if (axios.isAxiosError(e)) {
        setFormError(e.response?.data);
      }
    }
  };

  const setFormError = <IAxiosError extends unknown>(errors: IAxiosError) => {
    for (let error in errors) {
      setForm((prevState) => ({
        ...prevState,
        [error]: { ...prevState[error as keyof IRegisterForm], error: errors[error] },
      }));
    }
  };

  const checkErrors = () => {
    return Object.entries(form).some(
      ([key, val]) => val.error.length || !val.value.length
    );
  };

  const validate = () => {
    const submitted = Object.assign({}, form);
    for (const [key, field] of Object.entries(submitted)) {
      field.error = !field.value.trim().length ? 'Please fill out the field.' : '';
      if (['confirmpassword', 'password'].includes(key)) {
        field.error =
          submitted.password.value !== submitted.confirmpassword.value
            ? 'Passwords do not match.'
            : '';
      }
    }
    setForm(submitted);
  };

  const captureInput = (name: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IRegisterForm], value },
    }));
  };

  return (
    <form onSubmit={handleOnSubmit} style={{ width: '100%' }}>
      <Box mt={['1rem', '1rem', '10rem']}>
        <Heading color={theme === 'dark' ? '#FFF' : '#000'} textAlign="center" as="h3">
          Create Account
        </Heading>
      </Box>

      <FormInput
        id="email"
        name="email"
        active={true}
        helperText="We will never share your email."
        label="Email:"
        error={form.email.error}
        value={form.email.value}
        type="email"
        captureInput={captureInput}
      />

      <FormInput
        id="username"
        name="username"
        active={true}
        label="Username:"
        error={form.username.error}
        value={form.username.value}
        type="text"
        captureInput={captureInput}
      />

      <FormInput
        id="password"
        name="password"
        active={true}
        label="Password:"
        error={form.password.error}
        value={form.password.value}
        type="password"
        captureInput={captureInput}
      />

      <FormInput
        id="confirmpassword"
        name="confirmpassword"
        active={true}
        label="Confirm Password:"
        error={form.confirmpassword.error}
        value={form.confirmpassword.value}
        type="password"
        captureInput={captureInput}
      />

      <Box mt="2rem" display="flex" justifyContent="center">
        <Button type="submit" variant="entryButton">
          Create
        </Button>
      </Box>
    </form>
  );
};

export default RegisterForm;
