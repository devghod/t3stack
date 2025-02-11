"use client"

import {
  MantineReactTable,
  MRT_EditActionButtons,
  MRT_Row,
  MRT_TableOptions,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import defaultProfile from "@/assets/images/default-profile.jpg";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; 
import 'mantine-react-table/styles.css';
import { 
  ActionIcon, 
  Box, 
  Button, 
  Checkbox, 
  Group, 
  Menu, 
  Select, 
  Tooltip, 
  Text,
  Stack,
  Flex,
  Title,
  Drawer,
} from '@mantine/core';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconColumns, 
  IconDots, 
  IconDownload, 
  IconEdit, 
  IconEye, 
  IconEyeOff, 
  IconFilter, 
  IconFilterOff, 
  IconPrinter, 
  IconRefresh, 
  IconSearch, 
  IconSearchOff,
  IconTrash,
  IconUserPlus
} from '@tabler/icons-react';
import { ModalsProvider, modals } from '@mantine/modals';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { DatePickerInput } from '@mantine/dates';
import { timezones } from '@/constant/timezones';
import { quickDates } from '@/constant/dateCustom';
import { formatDateTz } from '@/utils/dateFormatting';
import { useAuthStore } from '@/stores/authStore';
import { TUser } from '@/types/user';
import { useUserStore } from '@/stores/userStore';
import AccountFormRegister from './AccountFormRegister';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});  

export default function AccountTable() {
  
  const { 
    users,  
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    loading,
  } = useUserStore();
  const profile = useAuthStore((state) => state.profile);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [timezone, setTimezone] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<{
    date: Date | null,
    value: string | null
  }>({
    date: null,
    value: null
  });
  
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    setTimezone(profile?.timezone || null);
  }, [profile]);


  const handleCreateUser = async ({
    values,
    exitCreatingMode,
  }: {
    values: any;  // eslint-disable-line
    exitCreatingMode: () => void;
  }) => {
    await createUser(values);
    exitCreatingMode();
  };

  const handleSaveUser: MRT_TableOptions<TUser>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    console.log(values);
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    // setValidationErrors({});
    await updateUser(values.id, values);
    table.setEditingRow(null); //exit editing mode
  };

  const openDeleteConfirmModal = (row: MRT_Row<TUser>) =>
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this user?',
      children: (
        <Text>
          Are you sure you want to delete {row.original.name}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser(row.original.id),
    });


  const handleExportRows = (rows: MRT_Row<TUser>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData as any); // eslint-disable-line
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<TUser>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
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
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorFn: (row) => {
          const sDay = new Date(row.createdAt);
          sDay.setHours(0, 0, 0, 0); 
          return sDay;
        },
        id: 'createdAt',
        header: 'Created At',
        filterVariant: 'date-range',
        sortingFn: 'datetime',
        enableColumnFilterModes: false,
        Cell: ({ cell }) => formatDateTz(
          cell.getValue<Date>(), 
          'dd/MM/yyyy HH:mm:ss', 
          timezone || 'UTC'
        ), 
        Header: ({ column }) => <em>{column.columnDef.header}</em>, 
      },
    ],
    [timezone],
  );

  const table = useMantineReactTable({
    columns,
    data: users,
    initialState: { 
      showColumnFilters: false,
      density: 'xs',
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    createDisplayMode: 'custom',
    editDisplayMode: 'modal',
    enableEditing: true,

    
    mantineEditRowModalProps: {
      closeOnClickOutside: true,
      withCloseButton: true,
    },

    getRowId: (originalRow) => originalRow.id,
    enableColumnFilters: true,
    enableColumnOrdering: false,
    enableColumnActions: false,
    enableSorting: false,
    enableToolbarInternalActions: false,
    enableHiding: true,
    state: {
      showSkeletons: loading, 
    },
    positionToolbarAlertBanner: 'bottom',

    // mantineToolbarAlertBannerProps: isLoadingUsersError
    //   ? {
    //       color: 'red',
    //       children: 'Error loading data',
    //     }
    //   : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: '500px',
      },
    },
    // onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    // onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,

    renderCreateRowModalContent: ({ table }) => (
      <Drawer
        opened={Boolean(table.getState().creatingRow)}
        onClose={() => table.setCreatingRow(null)}
        title="Create New User"
        position="left"
        closeOnClickOutside={false}
      >
        <AccountFormRegister 
          loadingUser={loading}
          onClose={() => table.setCreatingRow(null)}
          onSubmit={async (values) => {
            // await handleCreateUser({ 
            //   values, 
            //   exitCreatingMode: () => table.setCreatingRow(null)
            // });
            console.log(values);
          }}
        />
      </Drawer>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit User</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
      // <Drawer
      //   opened={Boolean(table.getState().creatingRow)}
      //   onClose={() => table.setCreatingRow(null)}
      //   title="Edit User"
      //   position="left"
      //   size="xl"
      // >
      //   <Stack>
      //     <Title order={3}>Edit User</Title>
      //     {internalEditComponents}
      //   </Stack>
      // </Drawer>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),

    renderBottomToolbar: ({ table }) => (
      <Group justify="flex-start" p="md">
        <Group gap="xs">
          <ActionIcon 
            variant="outline"
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()}
            color='gray.4'
          >
            <IconChevronLeft size={16} color='gray'/>
          </ActionIcon>
          {Array.from({ length: table.getPageCount() }, (_, index) => {
            const currentPage = table.getState().pagination.pageIndex;
            const totalPages = table.getPageCount();
            
            if (
              index === 0 ||
              index === totalPages - 1 || 
              (index >= currentPage - 1 && index <= currentPage + 1)
            ) {
              return (
                <ActionIcon
                  key={index}
                  variant={currentPage === index ? "filled" : "outline"}
                  onClick={() => table.setPageIndex(index)}
                  color={currentPage === index ? 'blue' : 'gray.4'}
                >
                  <Text 
                    size='sm' 
                    fw={600} 
                    c={currentPage === index ? 'white' : 'black'}
                  >
                    {index + 1}
                  </Text>
                </ActionIcon>
              );
            }
            
            if (
              index === 1 && currentPage > 2 ||
              index === totalPages - 2 && currentPage < totalPages - 3 
            ) {
              return (<IconDots key={index} size={16} />);
            }
            
            return null;
          })}
          <ActionIcon 
            variant="outline"
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
            color='gray.4'
          >
            <IconChevronRight size={16} />
          </ActionIcon>
        </Group>
      </Group>
    ),
  
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        style={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
          alignItems: 'flex-end'
        }}
      >

        <Button
          onClick={() => table.setCreatingRow(true)}
          leftSection={<IconUserPlus size={16} />}
        >
          New User
        </Button>

        <Select
          label="Quick Dates"
          placeholder="Pick value"
          data={quickDates.map((date) => (date.label))}
          onChange={(value: string | null) => handleFilterDate(value)}
          value={filterDate ? filterDate.value : null}
          disabled={loading}
          w="150px"
          clearable
        />

        <DatePickerInput
          label="Start Date" 
          placeholder="Start date"
          value={startDate}
          onChange={(date) => handleDateRange(date, 'start')}
          clearable
          w="150px"
          disabled={loading}
        />

        <DatePickerInput
          label="End Date" 
          placeholder="End date"
          value={endDate}
          onChange={(date) => handleDateRange(date, 'end')}
          clearable
          w="150px"
          disabled={loading}
          minDate={startDate ? new Date(startDate) : undefined}
        />

        <Select
          label="Timezone"
          placeholder="Pick timezone"
          data={timezones}
          w="150px"
          value={timezone}
          onChange={setTimezone}
          disabled={loading}
        />

        <Button
          onClick={getUsers}
          leftSection={<IconRefresh size={16} />}
          variant="filled"
          loading={loading}
          style={{ alignSelf: 'flex-end' }}
          size='sm'
        >
          Refresh Data
        </Button>

        <ActionIcon.Group style={{ alignSelf: 'flex-end' }}>

          <Tooltip label="Show/Hide Search">
            <ActionIcon
              variant='outline'
              size='lg'
              onClick={() => table.setShowGlobalFilter((prev) => !prev)}
            >
              {table.getState().showGlobalFilter ? (
                <IconSearchOff size={16} />
              ) : (
                <IconSearch size={16} />
              )}
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Print">
            <ActionIcon
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  const printData = table.getPrePaginationRowModel().rows.map(row => row.original);
                  const columnHeaders = columns.map(col => ({
                    key: col.accessorKey || col.id || '',
                    header: col.header?.toString() || ''
                  }));

                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Account Data</title>
                        <style>
                          table { 
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                          }
                          th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                          }
                          th {
                            background-color: #f4f4f4;
                          }
                          img {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            object-fit: cover;
                          }
                          @media print {
                            table { page-break-inside: auto }
                            tr { page-break-inside: avoid }
                          }
                        </style>
                      </head>
                      <body>
                        <table>
                          <thead>
                            <tr>
                              ${columnHeaders.map(col => 
                                `<th>${col.header}</th>`
                              ).join('')}
                            </tr>
                          </thead>
                          <tbody>
                            ${printData.map(row => `
                              <tr>
                                ${columnHeaders.map(col => {
                                  const value = row[col.key as keyof typeof row];
                                  if (col.key === 'createdAt') {
                                    return `<td>${new Date(value as string).toLocaleDateString()}</td>`;
                                  }
                                  return `<td>${value}</td>`;
                                }).join('')}
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </body>
                    </html>
                  `);
                  
                  printWindow.document.close();
                  printWindow.print();
                  printWindow.close();
                }
              }}
              variant='outline'
              size='lg'
            >
              <IconPrinter 
                size={16} 
              />
            </ActionIcon>
          </Tooltip>
        
          <Tooltip label="Export All Data to CSV">
            <ActionIcon
              onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
              variant='outline'
              size='lg'
            >
              <IconDownload 
                size={16} 
              />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Show/Hide Columns">
            <Menu 
              position="bottom-end" 
              withinPortal 
              closeOnItemClick={false} 
              closeOnClickOutside={true}
            >
              <Menu.Target>
                <ActionIcon
                  variant='outline'
                  size='lg'
                >
                  <IconColumns size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Toggle Columns</Menu.Label>
                {table.getAllLeafColumns().map((column) => {
                  return (
                    <Menu.Item
                      key={column.id}
                      onClick={() => column.toggleVisibility()}
                      leftSection={
                        <Checkbox
                          checked={column.getIsVisible()}
                          onChange={() => column.toggleVisibility()}
                          size="xs"
                        />
                      }
                    >
                      {typeof column.columnDef.header === 'string' 
                        ? column.columnDef.header 
                        : column.id}
                    </Menu.Item>
                  );
                })}
                <Menu.Divider />
                <Menu.Item
                  onClick={() => table.toggleAllColumnsVisible(true)}
                  leftSection={<IconEye size={16} />}
                >
                  Show All
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    const columns = table.getAllLeafColumns();
                    const firstCol = columns[0];
                    columns.forEach((col) => {
                      if (col.id !== firstCol.id) {
                        col.toggleVisibility(false);
                      }
                    });
                  }}
                  leftSection={<IconEyeOff size={16} />}
                >
                  Hide All
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Tooltip>

          <Tooltip label="Show/Hide Filter">
            <ActionIcon
              onClick={() => table.setShowColumnFilters((prev) => !prev)}
              variant='outline'
              size='lg'
            >
              {table.getState().showColumnFilters ? (
                <IconFilterOff size={16} />
              ) : (
                <IconFilter size={16} />
              )}
            </ActionIcon>
          </Tooltip>
        </ActionIcon.Group>

      </Box>
    ),
  });

  const handleDateRange = (
    date: Date | null, 
    value: 'start' | 'end'
  ) => {

    if (value === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }

    const newStartDate = value === 'start' ? date : startDate;
    const newEndDate = value === 'end' ? date : endDate;

    const filterColumn = table.getColumn('createdAt');
    if (!filterColumn) return;

    if (newStartDate && newEndDate) {
      filterColumn.setFilterValue([newStartDate, newEndDate]);
    } else if (newStartDate) {
      filterColumn.setFilterValue([newStartDate, newStartDate]); 
    } else {
      filterColumn.setFilterValue(null);
    }
  };

  const getDateRange = (label: string): { startDate: Date; endDate: Date } => {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23, 59, 59, 999
    );
  
    const ranges: Record<string, () => { startDate: Date; endDate: Date }> = {
      'Today': () => ({
        startDate: startOfDay,
        endDate: endOfDay
      }),
      'Yesterday': () => {
        const yesterday = new Date(startOfDay);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        return {
          startDate: yesterday,
          endDate: yesterdayEnd
        };
      },
      'Week to Date': () => {
        const weekStart = new Date(startOfDay);
        weekStart.setDate(weekStart.getDate() - 7);
        return {
          startDate: weekStart,
          endDate: endOfDay
        };
      },
      'Month to Date': () => {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          startDate: monthStart,
          endDate: endOfDay
        };
      },
      'Year to Date': () => {
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return {
          startDate: yearStart,
          endDate: endOfDay
        };
      },
      'Last Week': () => {
        const lastWeekStart = new Date(startOfDay);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);
        const lastWeekEnd = new Date(startOfDay);
        lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);
        return {
          startDate: lastWeekStart,
          endDate: lastWeekEnd
        };
      },
      'Last Month': () => {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
        return {
          startDate: lastMonthStart,
          endDate: lastMonthEnd
        };
      }
    };
  
    return ranges[label]?.() || { startDate: startOfDay, endDate: endOfDay };
  };
  
  const handleFilterDate = useCallback((value: string | null) => {
    const quickDate = value ? quickDates.find((d) => d.label === value) : null;
    setFilterDate({
      date: quickDate?.value || null,
      value: value || null
    });
  
    if (quickDate?.value) {
      const { startDate, endDate } = getDateRange(quickDate.label);
      table.getColumn('createdAt')?.setFilterValue([startDate, endDate]);
    } else {
      table.getColumn('createdAt')?.setFilterValue(null);
    }
  }, [table]);

  return (
    <>
      <MantineReactTable 
        table={table} 
      />
    </>
  );
}

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