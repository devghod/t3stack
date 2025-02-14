import { RegistrationSchema } from "@/schemas";
import { useUserStore } from "@/stores/userStore";
import { TextInput, PasswordInput, Space, Grid, Group, Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useState } from "react";
import { UserRole } from "@prisma/client";
import { timezones } from "@/constant/timezones";
import { notifications } from '@mantine/notifications';

import FormError from "../FormError";
import FormSuccess from "../FormSuccess";

export default function RegisterForm({ 
  loadingUser, 
  onClose 
}: {
  loadingUser: boolean;
  onClose: () => void;
}) {
  const { createUserGraphql } = useUserStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
      name: '',
      role: 'USER',
      timezone: 'UTC'
    },
    validate: yupResolver(RegistrationSchema),
  });

  const handleRegister = async ({ 
    name, 
    email, 
    password,
    role,
    timezone
  }: { 
    name: string, 
    email: string, 
    password: string,
    role: string,
    timezone: string,
    repeatPassword?: string
  }) => {
    try {
      const response = await createUserGraphql({ 
        name, 
        email, 
        password, 
        role: role as UserRole,
        timezone: timezone
      }) as unknown as { 
        success: boolean; 
        message?: string;
      };
      
      if (response.success) {
        if (response.message) setSuccessMsg(response.message);
        form.reset();
        onClose()
      } else if (response.message) {
        setErrorMsg(response.message);
      }
      notifications.show({
        title: response.success ? 'Success' : 'Fail',
        message: response.message,
        color: response.success ? 'green' : 'red',
      });
    } catch (error) { // eslint-disable-line
      setErrorMsg('Registration failed');
    }
    resetMsg();
  };

  const resetMsg = () => {
    setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 5000);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleRegister)}>
        <TextInput 
          {...form.getInputProps('name')} 
          label="Name" 
          placeholder="Name here" 
          disabled={loadingUser}
        />

        <TextInput 
          {...form.getInputProps('email')} 
          label="Email" 
          placeholder="Email here" 
          disabled={loadingUser}
        />

        <Select
          label="Role"
          placeholder="Pick value"
          data={['ADMIN', 'USER']}
          {...form.getInputProps('role')} 
          disabled={loadingUser}
        />

        <Select
          label="Timezone"
          placeholder="Pick value"
          data={timezones}
          {...form.getInputProps('timezone')} 
          disabled={loadingUser}
        />
        
        <PasswordInput 
          {...form.getInputProps('password')} 
          label="Password" 
          placeholder="Password here" 
          disabled={loadingUser}
        />

        <PasswordInput 
          {...form.getInputProps('repeatPassword')} 
          label="Repeat Password" 
          placeholder="Repeat password here" 
          disabled={loadingUser}
        />

        <FormSuccess message={successMsg} />
        <FormError message={errorMsg} />

        <Space h="md" />
        
        <Grid justify="space-between">
          <Grid.Col span="auto"></Grid.Col>
          <Grid.Col span={6}>
            <Group justify="flex-end" gap="xs">
              <Button 
                color="gray" 
                variant="light" 
                onClick={onClose}
                disabled={loadingUser}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                color="green"
                disabled={loadingUser}
                loading={loadingUser}
              >
                Register
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
}
