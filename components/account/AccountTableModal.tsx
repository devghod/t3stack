import { Button, Group, Modal, Space, Text, Grid } from "@mantine/core";
import AccountFormRegister from "./AccountFormRegister";
import { useUserStore } from "@/stores/userStore";
import { TUser } from "@/types/user";
import { memo, useEffect, useState } from "react";
import AccountFormEdit from "./AccountFormEdit";

type TAccountTableModal = {
  opened: boolean;
  type: 'edit' | 'delete' | 'register';
  userId?: string;
  onClose: () => void;
}

export default memo(function AccountTableModal({
  opened,
  type,
  userId,
  onClose,
}: TAccountTableModal) {

  const { getUserById, loadingUser, updateUser, deleteUser } = useUserStore();
  
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
    <Modal
      title={
        type === 'edit' 
          ? 'Update Account'
          : type === 'delete' 
            ? 'Delete Account' 
            : 'Register Account'
      }
      centered
      opened={opened}
      onClose={onClose}
    >
      {type === 'edit' ? (
        <AccountFormEdit 
          user={user}
          loadingUser={loadingUser}
          handleInputChange={handleInputChange}
          handleUpdate={handleUpdate}
          onClose={onClose}
        />
      ) : type === 'delete' ? (
        <DeleteForm
          loadingUser={loadingUser}
          handleDelete={handleDelete}
          onClose={onClose}
        />
      ) : (
        <AccountFormRegister
          loadingUser={loadingUser}
          onClose={onClose}
        />
      )}
    </Modal>
  )
});

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