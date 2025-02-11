import { useState, memo, useEffect } from "react";

import { useUserStore } from "@/stores/userStore";
import { TUser } from "@/types/user";
import AccountFormEdit from "./AccountFormEdit";
import AccountFormRegister from "./AccountFormRegister";
import { Drawer, Text, Space, Grid, Group, Button } from "@mantine/core";

export default function AccountDrawer({
  isOpen,
  onClose,
  type,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: 'register' | 'edit' | 'delete';
  userId?: string | null;
}) {

  const { loadingUser, getUserById, updateUser, deleteUser } = useUserStore();
  const initialUserState: TUser = {
    id: '',
    name: '',
    email: '',
    emailVerified: null,
    password: '',
    role: 'USER',
    timezone: 'UTC',
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const [user, setUser] = useState<TUser>(initialUserState);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        if (type === 'edit') {
          const response = await getUserById(userId) as unknown as { success: boolean; data: TUser };
          if (response?.success) {
            setUser(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [getUserById, userId, type]);

  const handleUpdate = async () => {
    try {
      if (!userId) return;

      const response = await updateUser(
        { 
          name: user.name || '', 
          email: user.email || '', 
          role: user.role,
          timezone: user.timezone || 'UTC'
        },
        userId
      ) as unknown as { success: boolean };

      if (response?.success) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!userId) return; 

      const response = await deleteUser(userId) as unknown as { success: boolean };
      if (response?.success) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleInputChange = (field: keyof TUser) => 
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === 'string' ? e : e.target.value;
      if (user) {
        setUser({ ...user, [field]: value });
      }
  };

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      title={type === 'register' ? 'Register New User' : type === 'edit' ? 'Edit User' : 'Delete User'}
      // transitionProps={{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }}
    > 
      {type === 'register' && (
        <AccountFormRegister
          loadingUser={loadingUser}
          onClose={onClose}
        />
      )}

      {type === 'edit' && (
        <AccountFormEdit
          user={user}
          loadingUser={loadingUser}
          handleInputChange={handleInputChange}
          handleUpdate={handleUpdate}
          onClose={onClose}
        />
      )}

      {type === 'delete' && (
        <DeleteForm
          loadingUser={loadingUser}
          handleDelete={handleDelete}
          onClose={onClose}
        />
      )}
    </Drawer>
  );
}

const DeleteForm = memo(({ 
  loadingUser, 
  handleDelete, 
  onClose 
}: {
  loadingUser: boolean;
  handleDelete: () => Promise<void>;
  onClose: () => void;
}) => (
  <>
    <Text p={10}>Are you sure you want to delete this user?</Text>

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
            color="red" 
            onClick={handleDelete} 
            loading={loadingUser}
          >
            Delete
          </Button>
        </Group>
      </Grid.Col>
    </Grid>
  </>
));

DeleteForm.displayName = 'DeleteForm';