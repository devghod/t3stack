"use client"

import { Box, Button, Center, Group, LoadingOverlay, Pagination, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { TUser } from "@/types/user";
import { useUserStore } from "@/stores/userStore";
import AccountTableRow from "./AccountTableRow";
import AccountTableModal from "./AccountTableModal";

type TModal = {
  type: 'delete' | 'update' | 'register' | null;
  userId?: string;
}

export default function AccountTable() {
  const { users, pagination, getUsersPagination, setPage, loading } = useUserStore();
  const [modalState, setModalState] = useState<TModal>({ type: null });

  useEffect(() => {
    getUsersPagination(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, getUsersPagination]);

  const handleEdit = (userId: string) => {
    setModalState({ type: 'update', userId });
  }

  const handleDelete = (userId: string) => {
    setModalState({ type: 'delete', userId });
  }

  const handleCloseModal = () => {
    setModalState({ type: null });
  }

  const handlePageChange = (page: number) => {
    setPage(page);
  }

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Button 
          leftSection={<FaPlus />} 
          size="xs" 
          color="green" 
          onClick={() => setModalState({ type: 'register' })}
        >
          Add User
        </Button>
      </Group>
  
      <Table.ScrollContainer minWidth={380} h="380">
        <Box pos="relative" h={380}>
          <LoadingOverlay visible={loading} zIndex={1000} />
          <Table 
            striped
            highlightOnHover 
            withTableBorder 
            layout="fixed"
            verticalSpacing="xs"
          >
            <Table.Thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <Table.Tr>  
                <Table.Th w={100}>Profile</Table.Th>
                <Table.Th w={200}>Name</Table.Th>
                <Table.Th w={200}>Email</Table.Th>
                <Table.Th w={100}>Role</Table.Th>
                <Table.Th w={100}>Timezone</Table.Th>
                <Table.Th w={200}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {users.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" fz="xl" c="gray.5">No users found</Table.Td>
                </Table.Tr>
              ) : (
                users.map((user: TUser) => (
                  <AccountTableRow 
                    key={user.id} 
                    user={user} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </Table.ScrollContainer>
      <Center mt="md">
        <Pagination
          value={pagination.page}
          onChange={handlePageChange}
          total={pagination.totalPages}
        />
      </Center>
      {modalState.type && (
        <AccountTableModal
          type={modalState.type}
          userId={modalState.userId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
