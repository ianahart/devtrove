import { useState } from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';
import { IRegisterForm } from '../../interfaces';
import EntryInput from './EntryInput';

const RegisterForm = (): JSX.Element => {
  const initialForm = {
    email: { name: 'email', value: '', error: '' },
    username: { name: 'username', value: '', error: '' },
    password: { name: 'password', value: '', error: '' },
    confirmpassword: { name: 'confirmpassword', value: '', error: '' },
  };
  const [form, setForm] = useState<IRegisterForm>(initialForm);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      validate();
      if (checkErrors()) {
        return;
      }

      const response = await axios({
        method: 'POST',
        url: '/api/v1/account/',
        data: {
          username: form.username.value,
          email: form.email.value,
          password: form.password.value,
        },
      });

      if (response.status === 200) {
        console.log(response);
      }

      setForm(initialForm);
    } catch (e) {
      console.log(e);
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
        <Heading color="#FFF" textAlign="center" as="h3">
          Create Account
        </Heading>
      </Box>

      <EntryInput
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

      <EntryInput
        id="username"
        name="username"
        active={true}
        label="Username:"
        error={form.username.error}
        value={form.username.value}
        type="text"
        captureInput={captureInput}
      />

      <EntryInput
        id="password"
        name="password"
        active={true}
        label="Password:"
        error={form.password.error}
        value={form.password.value}
        type="password"
        captureInput={captureInput}
      />

      <EntryInput
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
