'use client'

import { useUserStore } from '@/stores/userStore';
import { TUser } from '@/types/user';
import { useEffect, useMemo, useState } from 'react';
import { 
  ActionIcon, 
  Box, 
  Tooltip,
  Group,
} from '@mantine/core';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { 
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { profileImage } from '@/utils/image';

import AccountTableModal from '../account/AccountTableModal';

import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css'; 

type TModal = {
  type: 'delete' | 'edit' | 'register' | null;
  userId?: string;
  open: boolean;
}

function MDatatable() {

  const { 
    users, 
    getUsersPaginationGraphql, 
    pagination: paginate, 
    loading,
    setPageLimit,
  } = useUserStore();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<TUser[]>(users); 
  const [modalState, setModalState] = useState<TModal>({ 
    type: null, 
    userId: '', 
    open: false 
  });

  useEffect(() => {
    setData(() => [...users]); 
    console.log("Update User Collection 😱");
  }, [users]);
  
  useEffect(() => {
    getUsersPaginationGraphql(pagination.pageIndex, pagination.pageSize);
    setPageLimit(pagination.pageIndex, pagination.pageSize);
    console.log("Pagination 🏃");
  }, [
    getUsersPaginationGraphql, 
    pagination.pageIndex, 
    pagination.pageSize,
    paginate.page,
    paginate.limit,
    setPageLimit
  ]);

  const columns = useMemo<MRT_ColumnDef<TUser>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ renderedCellValue, row }) => (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {profileImage(row.original.image)}
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: 'email', //normal accessorKey
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'timezone',
        header: 'Timezone',
      },
    ],
    [],
  );

  const handleCloseModal = () => {
    setModalState({ type: null, userId: '', open: false });
  }

  const table = useMantineReactTable({
    columns,
    data,
    initialState: { 
      showColumnFilters: false,
      density: 'xs',
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    state: { 
      pagination, 
      showSkeletons: loading, 
      isLoading: loading,
    },
    enableRowActions: true,
    positionActionsColumn: 'last',
    onPaginationChange: setPagination,
    mantinePaginationProps: {
      showRowsPerPage: false,
    },
    paginationDisplayMode: 'pages',
    manualPagination: true,
    rowCount: paginate.total,

    // create
    createDisplayMode: 'modal',
    // onCreatingRowSave: handleCreateUser,
    // edit
    editDisplayMode: 'modal',
    enableEditing: true,
    // onEditingRowSave: handleSaveRow,
    // mantineEditRowModalProps: {
    //   closeOnClickOutside: true,
    //   withCloseButton: true,
    // },

    getRowId: (originalRow) => originalRow.id,
    enableColumnFilters: true,
    enableColumnOrdering: false,
    enableColumnActions: false,
    enableSorting: false,
    // enableToolbarInternalActions: false,
    enableHiding: true,
    
    positionToolbarAlertBanner: 'bottom',
    mantineTableContainerProps: {
      style: {
        minHeight: '300px',
      },
    },
    mantineTableProps: {
      striped: 'odd',
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
    },
    // Actions
    renderRowActions: ({ row }) => (
      <Group gap='xs'>
        <Tooltip label="Edit">
          <ActionIcon 
            color="green" 
            onClick={() => 
              setModalState({
                ...modalState,
                type: 'edit',
                open: true,
                userId: row.id
              })
            }
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon 
            color="red" 
            onClick={() => 
              setModalState({
                ...modalState,
                type: 'delete',
                open: true,
                userId: row.id
              })
            }
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
    renderTopToolbarCustomActions: () => (
      <>
        <Tooltip label="Create New User">
          <ActionIcon 
            onClick={() => 
              setModalState({ 
                ...modalState, 
                type: 'register', 
                open: true
              })
            }
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Tooltip>
      </>
    ),
  });

  return (
    <div>
      <h4>MDatatable</h4>
      <MantineReactTable key={data.length} table={table} />
      <AccountTableModal
        opened={modalState.open}
        type={modalState.type}
        userId={modalState.userId}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default MDatatable;
