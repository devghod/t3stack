'use client'

import { useState, useTransition } from 'react';
import { yupResolver } from 'mantine-form-yup-resolver';
import { useForm } from '@mantine/form';
import { 
  Button, 
  Space, 
  PasswordInput, 
  Text,
  TextInput,
  Center,
  Select,
  Card,
  Stack,
  Flex,
  Container
} from '@mantine/core';
import { RegistrationSchema } from '@/schemas';
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import { useAuthStore } from '@/stores/authStore';
import { redirect } from 'next/navigation';
import { timezones } from "@/constant/timezones";

export default function Register() {

  const { register, loading } = useAuthStore();
  const [ isPending, startTransition ] = useTransition(); // eslint-disable-line
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState('');

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
      name: '',
      timezone: 'UTC',
      role: 'USER'
    },
    validate: yupResolver(RegistrationSchema),
  });

  const onSubmit = ({ 
    name, 
    email, 
    password,
    timezone
  }: { 
    name: string, 
    email: string, 
    password: string,
    timezone: string,
    repeatPassword?: string
  }) => {
    startTransition(() => {
      register({ 
        name, 
        email, 
        password, 
        role: "USER",
        timezone: timezone
      })
        .then((res: any) => { // eslint-disable-line
          if (res.success && res.message) {
            setSuccessMsg(res.message);
            form.reset();
          } else {
            setErrorMsg(res.message);
          }
          resetMsg();
        });
    });
  }

  const resetMsg = () => {
    setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 5000);
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
            <h3>Registration Form</h3>
          </Center>

          <Space h="xl" />

          <Stack gap="xs">
            <form onSubmit={form.onSubmit(onSubmit)}>
              <TextInput 
              {...form.getInputProps('name')} 
              label="Name" 
              placeholder="Name here" 
              disabled={loading}
            />

            <TextInput 
              {...form.getInputProps('email')} 
              label="Email" 
              placeholder="Email here" 
              disabled={loading}
            />

            <Select
              label="Timezone"
              placeholder="Pick value"
              data={timezones}
              {...form.getInputProps('timezone')} 
              disabled={loading}
            />
            
            <PasswordInput 
              {...form.getInputProps('password')} 
              label="Password" 
              placeholder="Password here" 
              disabled={loading}
            />

            <PasswordInput 
              {...form.getInputProps('repeatPassword')} 
              label="Repeat Password" 
              placeholder="Repeat password here" 
              disabled={loading}
            />

            <FormSuccess message={successMsg} />
            <FormError message={errorMsg} />
            
            <Button 
              type="submit" 
              mt='xl' 
              fullWidth
              loading={loading}
            >
              Register
            </Button>
          </form>

          <Space h="md" />

          <Center>
            <Button
              variant='transparent'
              onClick={() => redirect('/auth/login')}
            >
              <Text size='xs' c='dark'>
                Sign In?
              </Text>
            </Button>
          </Center>
          </Stack>
        </Card>
      </Flex>
    </Container>
  );
}
