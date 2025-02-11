import { Group, Text, Menu, ActionIcon } from '@mantine/core'
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { FaGhost } from 'react-icons/fa'
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";

export default function Header() {

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  }

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        {/* <Text visibleFrom='sm'>Desktop</Text>
        <Text hiddenFrom='sm'>Mobile</Text> */}
        <FaGhost />
        <Text>Admin</Text>
      </Group>
      <Group>
        <Menu withArrow>
          <Menu.Target>
            <ActionIcon 
              variant='subtle'
              color='gray'
              size='lg'
            >
              <BsThreeDotsVertical size={14} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={handleSignOut}
              disabled={isLoading}
              leftSection={<RiShutDownLine size={14} />}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}
