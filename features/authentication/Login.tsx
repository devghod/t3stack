'use client'

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { yupResolver } from 'mantine-form-yup-resolver';
import { useForm } from '@mantine/form';
import { 
  Button, 
  Space, 
  PasswordInput, 
  Text,
  TextInput,
  Center,
  Container,
  Stack,
  Card,
  Flex,
} from '@mantine/core';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import { useAuthStore } from '@/stores/authStore';
import { Tlogin } from '@/types/auth';
import { redirect } from 'next/navigation';

export default function Login() {

  const { login, loading } = useAuthStore();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isPending, startTransition ] = useTransition(); // eslint-disable-line
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState('');

  const handleLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    await signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    });
    setIsLoading(false);
  }

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: yupResolver(LoginSchema),
  });

  const onSubmit = (data: Tlogin) => {
    resetMsg();
    startTransition(() => {
      login(data)
        .then((res) => {
          if (res?.success) {
            setSuccessMsg(res.success);
            form.reset();
          }
          if (res?.error) setErrorMsg(res.error);
        });
    });
  }

  const resetMsg = () => {
    setErrorMsg('');
    setSuccessMsg('');
  }

  return (
    <Container>
      <Flex h="100vh" justify="center" align="center">
        <Card
          w="350"
          bg="white"
          radius="lg"
          shadow="lg"
        >
          <Center>
            <h3>Login Form</h3>
          </Center>
          <Space h="xl" />
          <Stack gap="xs">
            <form onSubmit={form.onSubmit(onSubmit)}>
              <TextInput 
                {...form.getInputProps('email')} 
                label="Email" 
                placeholder="Email here" 
              />
              <PasswordInput 
                {...form.getInputProps('password')} 
                label="Password" 
                placeholder="Password here" 
              />
              <FormSuccess message={successMsg} />
              <FormError message={errorMsg} />
              <Button 
                type="submit" 
                mt='xl' 
                fullWidth
                loading={loading}
                disabled={loading || isLoading}
              >
                Sign In
              </Button>
            </form>
            <Space h="xs" />
            <Center style={{ display: 'flex', placeContent: 'space-between' }}>
              <Button
                variant='light'
                onClick={() => handleLogin("google")}
                fullWidth
                disabled={loading || isLoading}
              >
                <FcGoogle />
              </Button>
              <Space w="xl" />
              <Button
                variant='light'
                onClick={() => handleLogin("github")}
                fullWidth
                c={'dark'}
                disabled={loading || isLoading}
              >
                <FaGithub />
              </Button>
            </Center>

            <Center>
              <Button
                variant='transparent'
                onClick={() => redirect('/auth/register')}
              >
                <Text size='xs' c='dark'>
                  No Account?
                </Text>
              </Button>
            </Center>
          </Stack>
        </Card>
      </Flex>
    </Container>
  );
}
