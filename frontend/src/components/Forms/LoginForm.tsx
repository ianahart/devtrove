import { Box, Button, Heading, Link, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/global';
import { IGlobalContext, ILoginForm } from '../../interfaces';
import EntryInput from './EntryInput';

const LoginForm: React.FC = () => {
  const initialForm = {
    email: { name: 'email', value: '', error: '' },
    password: { name: 'password', value: '', error: '' },
  };
  const navigate = useNavigate();
  const { closeModal } = useContext(GlobalContext) as IGlobalContext;
  const [form, setForm] = useState<ILoginForm>(initialForm);
  const [formError, setFormError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

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

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validate();
    if (errors().length) {
      return;
    }
    setIsLoaded(true);
    console.log('Logging user in...');
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
        id="email"
        name="email"
        label="Email"
        error={form.email.error}
        value={form.email.value}
        type="email"
        captureInput={captureInput}
      />
      <EntryInput
        id="password"
        name="password"
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
