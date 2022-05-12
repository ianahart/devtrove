import { Box, Button, FormControl, Heading, Icon, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import axios, { AxiosError } from 'axios';
import { http } from '../../helpers';
import bgImage from '../../images/forgot_password.png';
import FormInput from '../Forms/FormInput';
import Spinner from './Spinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState({ name: 'email', error: '', value: '' });
  const [emailSentMsg, setEmailSentMsg] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);

  const captureInput = (name: string, value: string) => {
    setEmail((prevState) => ({ ...prevState, value }));
  };

  const validate = () => {
    if (email.value.trim().length === 0) {
      setEmail((prevState) => ({ ...prevState, error: 'Please provide your email.' }));
    }
  };

  const clearErrors = () => {
    setEmail((prevState) => ({ ...prevState, error: '' }));
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      clearErrors();
      validate();
      if (email.error.length) {
        return;
      }
      setIsLoaded(false);
      const response = await http.post('/auth/forgot-password/', { email: email.value });
      if (response.status === 200) {
        setEmailSentMsg('Email has been sent. Check your email.');
        setEmail(Object.assign({}, { name: 'email', value: '', error: '' }));
        setIsLoaded(true);
      }
    } catch (e: unknown | AxiosError) {
      setIsLoaded(true);
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        const error = e.response?.data.error;
        if (e.response?.status === 400 || e.response?.status === 404) {
          setEmail((prevState) => ({ ...prevState, error: error.email[0] }));
        }
      }
    }
  };

  return (
    <Box>
      {!isLoaded ? (
        <Spinner text="Sending Email..." />
      ) : (
        <Box
          backgroundImage={bgImage}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          height="100%"
          width="100%"
          minH="100vh"
        >
          <Box
            height="80vh"
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              bg="#000"
              p="0.5rem"
              boxShadow="md"
              borderRadius="12px"
              minH="500px"
              width={['95%', '400px', '400px']}
            >
              <Box
                flexDir="column"
                alignItems="center"
                display="flex"
                justifyContent="center"
                m="3rem auto 1rem auto"
                as="header"
              >
                <Heading color="#FFF" fontSize="26px" as="h3">
                  Forgot Password
                </Heading>
                <Text mt="1rem" fontSize="0.9rem" textAlign="center" color="text.primary">
                  Please enter your email address and we'll send you instructions on how
                  to reset your password.
                </Text>
                {emailSentMsg.length > 0 && (
                  <Box
                    mt="4rem"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Icon
                      mr="0.25rem"
                      as={AiOutlineCheckCircle}
                      fontSize="24px"
                      color="purple.secondary"
                    />
                    <Text color="purple.secondary">{emailSentMsg}</Text>
                  </Box>
                )}
              </Box>
              {emailSentMsg.length === 0 && (
                <Box mt="2rem">
                  <form onSubmit={handleOnSubmit}>
                    <FormControl>
                      <FormInput
                        captureInput={captureInput}
                        value={email.value}
                        error={email.error}
                        active={true}
                        name="email"
                        label="Your Email:"
                        type="email"
                      />
                    </FormControl>
                    <Box mt="4rem" display="flex" justifyContent="center">
                      <Button type="submit" variant="entryButton">
                        Send Reset Email
                      </Button>
                    </Box>
                  </form>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ForgotPassword;
