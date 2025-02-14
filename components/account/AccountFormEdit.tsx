import { timezones } from "@/constant/timezones";
import { TUser } from "@/types/user";
import { Group, TextInput, Space, Grid, Button, Select } from "@mantine/core";

export default function AccountFormEdit({ 
  user, 
  loadingUser, 
  handleInputChange, 
  handleUpdate, 
  onClose 
}: {
  user: TUser;
  loadingUser: boolean;
  handleInputChange: (field: keyof TUser) => 
    ((e: React.ChangeEvent<HTMLInputElement> | string) => void);
  handleUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  return (
  <>
    <Group>
      <TextInput 
        label="Name" 
        value={user?.name || ''} 
        onChange={handleInputChange('name')}
        disabled={loadingUser}
      />
      <TextInput 
        label="Email" 
        value={user?.email || ''} 
        onChange={handleInputChange('email')}
        disabled={loadingUser}
      />
    </Group>

    <Space h="xs" />

    <Group>
      <Select
        label="Role"
        placeholder="Pick value"
        value={user?.role}
        data={['ADMIN', 'USER']}
        onChange={(value) => handleInputChange('role')(value || '')}
        disabled={loadingUser}
      />
      <Select
        label="Timezone"
        placeholder="Pick value"
        value={user?.timezone}
        data={timezones}
        onChange={(value) => handleInputChange('timezone')(value || '')}
        disabled={loadingUser}
      />
    </Group>

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
            color="green" 
            onClick={handleUpdate}
            loading={loadingUser}
          >
            Update
          </Button>
        </Group>
      </Grid.Col>
    </Grid>
  </>
)};