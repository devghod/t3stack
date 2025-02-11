import { Badge, Button, Group, Table, Text } from "@mantine/core";
import { FaEdit, FaTrash } from "react-icons/fa";
import { memo } from "react";
import { TUser } from "@/types/user";
import { UserRole } from "@prisma/client";
import Image from "next/image";
import defaultProfile from "@/assets/images/default-profile.jpg";

function AccountTableRow({ 
  user,
  onEdit, 
  onDelete 
}: { 
  user: TUser, 
  onEdit: (userId: string) => void, 
  onDelete: (userId: string) => void
}) {
  return (
    <Table.Tr>
      <Table.Td>{profileImage(user.image || null)}</Table.Td>
      <Table.Td>
        <Text fw={500}>{user.name}</Text>
        <Text size="xs" color="gray">{user.id}</Text>
      </Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{roleBadge(user.role)}</Table.Td>
      <Table.Td>{user.timezone}</Table.Td>
      <Table.Td >
        <Group>
          <Button
            onClick={() => onEdit(user.id)}
            color="green"
            size="xs"
            leftSection={<FaEdit />}
          >Edit</Button>
          <Button
            color="red"
            size="xs"
            leftSection={<FaTrash />}
            onClick={() => onDelete(user.id)}
          >Delete</Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

export default memo(AccountTableRow);

const roleBadge = (role: UserRole) =>  (
  <Badge 
    variant="light" 
    size="xs" 
    color={role === "ADMIN" ? "green" : "gray"}
  >
    {role}
  </Badge>
);

const profileImage = (image: string | null) => {
  const profileImage = image || defaultProfile;
  return (
    <Image
      src={profileImage}
      alt="Profile picture"
      width={40}
      height={40}
      style={{ objectFit: 'cover', borderRadius: '50%' }}
      priority
    />
  );
}