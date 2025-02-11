'use client';

import { Flex, Card, Space, Text } from "@mantine/core";
import Image from "next/image";
import defaultProfile from "@/assets/images/default-profile.jpg";

function ProfileInfo({ 
  user 
}: { 
  user: {
    name: string;
    email: string;
    role?: string;
    timezone?: string;
    image?: string;
  }
}) {

  const profileImage = user.image || defaultProfile;

  return (
    <>
      <Text fw="bold" fz="xl">Personal Information</Text>

      <Space h="md" />

      <Card withBorder radius="md" p="md" shadow="none" mb={10}>
        <Flex justify="space-between" align="center">
          <Text fw={500} fz="md" >Profile</Text>
          <Image
            src={profileImage}
            alt="Profile picture"
            width={40}
            height={40}
            style={{ objectFit: 'cover', borderRadius: '50%' }}
            priority
          />
        </Flex>
      </Card>

      <Card withBorder radius="md" p="md" shadow="none" mb={10}>
        <Flex justify="space-between">
          <Text fw={500} fz="md">Name</Text>
          <Text fz="sm">{user?.name}</Text>
        </Flex>
      </Card>

      <Card withBorder radius="md" p="md" shadow="none" mb={10}>
        <Flex justify="space-between">
          <Text fw={500} fz="md">Email</Text>
          <Text fz="sm">{user?.email}</Text>
        </Flex>
      </Card>

      <Card withBorder radius="md" p="md" shadow="none" mb={10}>
        <Flex justify="space-between">
          <Text fw={500} fz="md">Role</Text>
          <Text fz="sm">{user?.role}</Text>
        </Flex>
      </Card>

      <Card withBorder radius="md" p="md" shadow="none" mb={10}>
        <Flex justify="space-between">
          <Text fw={500} fz="md">Timezone</Text>
          <Text fz="sm">{user?.timezone}</Text>
        </Flex>
      </Card>
    </>
  );
}

export default ProfileInfo;