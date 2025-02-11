'use client';

import { timezones } from '@/constant/timezones';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { 
  ActionIcon, 
  Box, 
  Button, 
  Checkbox, 
  Text, 
  Group,
  Menu, 
  Tooltip, 
  TextInput, 
  CheckboxProps,
  Select,
  Grid,
  Alert,
  Stack,
} from '@mantine/core';
import {  DatePickerInput } from '@mantine/dates';
import { 
  IconColumns, 
  IconDownload, 
  IconEye, 
  IconEyeOff, 
  IconPrinter, 
  IconRefresh, 
  IconSearch, 
  IconUserPlus, 
  IconTrash, 
  IconEdit, 
  IconCalendar, 
  IconFilter, 
  IconX,
  IconChartDots2,
  IconAlertCircle
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { quickDates } from '@/constant/dateCustom';
import { TUser } from '@/types/user';
import { useDisclosure } from '@mantine/hooks';
import { formatDateTz } from '@/utils/dateFormatting';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { getDateRange } from '@/utils/quickDate';
import AccountTableModal from '@/components/account/AccountTableModal';
import classes from './account.module.css';
import AccountChartByRegisterType from '../statistics/AccountChartByRegisterType';
import AccountDrawer from './AccountDrawer';
import '@mantine/dates/styles.css';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});  

const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconEyeOff {...others} /> : <IconEye {...others} />;

export default function AccountTable() {

  const { 
    users,  
    getUsersPaginationGraphql,
    pagination,
    setPage,
    loading,
    error
  } = useUserStore(); 
  const profile = useAuthStore((state) => state.profile);
  const [opened, { open, close }] = useDisclosure(false);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [timezone, setTimezone] = useState<string>('');
  const [type, setType] = useState<'register' | 'edit' | 'delete'>('register');
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [filterByColumns, setFilterByColumns] = useState<{
    id: string,
    name: string,
    email: string,
    timezone: string,
    role: string,
    createdAt: string,
  }>({
    id: '',
    name: '',
    email: '',
    timezone: '',
    role: '',
    createdAt: '',
  });
  const [columnOptions, setColumnOptions] = useState<any[]>([ // eslint-disable-line
    {
      accessor: 'id',
      name: 'ID',
      hidden: false,
      filter: false,
    },
    {
      accessor: 'name',
      name: 'Name',
      hidden: false,
      filter: false,
    },
    {
      accessor: 'email',
      name: 'Email',
      hidden: false,
      filter: false,
    },
    {
      accessor: 'timezone',
      name: 'Timezone',
      hidden: false,
      filter: false,
    },
    {
      accessor: 'role',
      name: 'Role',
      hidden: false,
      filter: false,
    },  
    {
      accessor: 'createdAt',
      name: 'Created At',
      hidden: false,
      filter: false,
    },  
    {
      accessor: 'actions',
      name: 'Actions',
      hidden: false,
    },
  ]);
  const [filterDate, setFilterDate] = useState<{
    date: Date | null,
    value: string | null
  }>({
    date: null,
    value: null
  });

  useEffect(() => {
    getUsersPaginationGraphql(pagination.page, pagination.limit);
  }, [getUsersPaginationGraphql, pagination.page, pagination.limit]);

  useEffect(() => {
    setTimezone(profile?.timezone || 'UTC');
  }, [profile]);

  const columns = useMemo(() => [
    {
      accessor: 'id',
      title: 'ID',
      width: 150,
      render: (record: TUser) => (
        <Text truncate="end" size='sm'>
          {record.id}
        </Text>
      ),
      hidden: columnOptions.find((col) => col.accessor === 'id')?.hidden,
      filter: (columnOptions.find((col) => col.accessor === 'id')?.filter) ? (
        <TextInput
          label="ID"
          placeholder="Search ID..."
          leftSection={<IconSearch size={16} />}
          rightSection={<IconX size={16} onClick={() => setFilterByColumns({ ...filterByColumns, id: '' })} />}
          value={filterByColumns.id}
          onChange={(e) => setFilterByColumns({ ...filterByColumns, id: e.target.value })}
        />
      ) : undefined,
      filtering: true,
    },
    { 
      accessor: 'name', 
      title: 'Name', 
      width: 150, 
      render: (record: TUser) => (
        <Text truncate="end" size='sm'>
          {record.name}
        </Text>
      ),
      hidden: columnOptions.find((col) => col.accessor === 'name')?.hidden,
      filter: (columnOptions.find((col) => col.accessor === 'name')?.filter) ? (
        <TextInput
          label="Name"
          placeholder="Search name..."
          leftSection={<IconSearch size={16} />}
          rightSection={<IconX size={16} onClick={() => setFilterByColumns({ ...filterByColumns, name: '' })} />}
          value={filterByColumns.name}
          onChange={(e) => setFilterByColumns({ ...filterByColumns, name: e.target.value })}
        />
      ) : undefined,
      filtering: true,
    },
    { 
      accessor: 'email', 
      title: 'Email', 
      width: 200,   
      render: (record: TUser) => (
        <Text truncate="end" size='sm'>
          {record.email}
        </Text>
      ),
      hidden: columnOptions.find((col) => col.accessor === 'email')?.hidden,
      filter: (columnOptions.find((col) => col.accessor === 'email')?.filter) ? (
        <TextInput
          label="Email"
          placeholder="Search email..."
          leftSection={<IconSearch size={16} />}
          rightSection={<IconX size={16} onClick={() => setFilterByColumns({ ...filterByColumns, email: '' })} />}
          value={filterByColumns.email}
          onChange={(e) => setFilterByColumns({ ...filterByColumns, email: e.target.value })}
        />
      ) : undefined,
      filtering: true,
    },
    { 
      accessor: 'timezone', 
      title: 'Timezone', 
      width: 150, 
      render: (record: TUser) => (
        <Text truncate="end" size='sm'>
          {record.timezone}
        </Text>
      ),
      hidden: columnOptions.find((col) => col.accessor === 'timezone')?.hidden,
      filter: (columnOptions.find((col) => col.accessor === 'timezone')?.filter) ? (
        <TextInput
          label="Timezone"
          placeholder="Search timezone..."
          leftSection={<IconSearch size={16} />}
          rightSection={<IconX size={16} onClick={() => setFilterByColumns({ ...filterByColumns, timezone: '' })} />}
          value={filterByColumns.timezone}
          onChange={(e) => setFilterByColumns({ ...filterByColumns, timezone: e.target.value })}
        />
      ) : undefined,
      filtering: true,
    },
    {
      accessor: 'role',
      title: 'Role',
      width: 70,
      render: (record: TUser) => (
        <Box fw={700} c={record.role === 'ADMIN' ? 'blue' : 'red'}>
          {record.role.toUpperCase()}
        </Box>
      ),
      hidden: columnOptions.find((col) => col.accessor === 'role')?.hidden,
      filter: (columnOptions.find((col) => col.accessor === 'role')?.filter) ? (
        <TextInput
          label="Role"
          placeholder="Search role..."
          leftSection={<IconSearch size={16} />}
          rightSection={<IconX size={16} onClick={() => setFilterByColumns({ ...filterByColumns, role: '' })} />}
          value={filterByColumns.role}
          onChange={(e) => setFilterByColumns({ ...filterByColumns, role: e.target.value })}
        />
      ) : undefined,
      filtering: true,
    },
    {
      accessor: 'createdAt',
      title: 'Created At',
      width: 100,
      render: (record: TUser) => (
        <Text>
          {formatDateTz(
            record.createdAt, 
            'dd/MM/yyyy', 
            timezone
          )}
        </Text>
      ),
      hidden: columnOptions.find((col) => col.accessor === 'createdAt')?.hidden,
      filter: (columnOptions.find((col) => col.accessor === 'createdAt')?.filter) ? (
        <TextInput
          label="Created At"
          placeholder="Search created at..."
          leftSection={<IconSearch size={16} />}
          rightSection={<IconX size={16} onClick={() => setFilterByColumns({ ...filterByColumns, createdAt: '' })} />}
          value={filterByColumns.createdAt}
          onChange={(e) => setFilterByColumns({ ...filterByColumns, createdAt: e.target.value })}
        />
      ) : undefined,
      filtering: true,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      width: 80,
      render: (record: TUser) => (
        <Group gap="xs">
          <ActionIcon 
            onClick={() => {
              open();
              setType('edit');
              setUserId(record.id);
            }}
            size='sm' 
            color='green'
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon 
            onClick={() => {
              open();
              setType('delete');
              setUserId(record.id);
            }}
            size='sm' 
            color='red'
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
      hidden: columnOptions.find((col) => col.accessor === 'actions')?.hidden,
    },
  ], [
    timezone, 
    open, 
    setType, 
    setUserId, 
    columnOptions, 
    filterByColumns
  ]);

  const computedUsers = useMemo(() => {
    return users.filter((user) => {

      if (startDate && endDate) {
        const createdAt = formatDateTz(user.createdAt, 'yyyy-MM-dd', timezone);
        const start = formatDateTz(startDate, 'yyyy-MM-dd', timezone);
        const end = formatDateTz(endDate, 'yyyy-MM-dd', timezone);
        return createdAt >= start && createdAt <= end;
      }

      if (startDate && !endDate) {
        const createdAt = formatDateTz(user.createdAt, 'yyyy-MM-dd', timezone);
        const start = formatDateTz(startDate, 'yyyy-MM-dd', timezone);
        return createdAt === start;
      }

      if (search) {
        return user.name?.toLowerCase().includes(search.toLowerCase());
      }

      if (filterByColumns.id) {
        return user.id?.toString().includes(filterByColumns.id);
      }

      if (filterByColumns.name) {
        return user.name?.toLowerCase().includes(filterByColumns.name.toLowerCase());
      }   

      if (filterByColumns.email) {
        return user.email?.toLowerCase().includes(filterByColumns.email.toLowerCase());
      }

      if (filterByColumns.timezone) {
        return user.timezone?.toLowerCase().includes(filterByColumns.timezone.toLowerCase());
      }

      if (filterByColumns.role) {
        return user.role?.toLowerCase().includes(filterByColumns.role.toLowerCase());
      }

      if (filterByColumns.createdAt) {
        return formatDateTz(user.createdAt, 'yyyy-MM-dd', timezone).includes(filterByColumns.createdAt);
      }

      return true;
    });
  }, [users, startDate, endDate, timezone, search, filterByColumns]);

  const handleExportRows = (rows: any) => { // eslint-disable-line
    const rowData = rows.map((row: any) => row); // eslint-disable-line
    const csv = generateCsv(csvConfig)(rowData as any); // eslint-disable-line
    download(csvConfig)(csv);
  };

  const handleColumnVisibility = (hidden: boolean) => {
    setColumnOptions(
      columnOptions.map((column) => 
        column.accessor === column.accessor ? 
        { ...column, hidden: hidden } : 
        column
      ))
  }; 

  const handleSetHiddenColumn = (accessor: string, hidden: boolean) => {
    setColumnOptions(
      columnOptions.map((column) => 
        column.accessor === accessor ? { ...column, hidden: hidden } : column
      )
    );
  };

  const handleSetFilterColumn = (accessor: string, filter: boolean) => {
    setColumnOptions(
      columnOptions.map((column) => 
        column.accessor === accessor ? { ...column, filter: filter } : column
      )
    );
  };

  const handleDateRange = (date: Date | null, value: 'start' | 'end') => { 
    if (value === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleFilterDate = useCallback((value: string | null) => {
    const quickDate = value ? quickDates.find((d) => d.label === value) : null;
    setFilterDate({
      date: quickDate?.value || null,
      value: value || null
    });
  
    if (quickDate?.value) {
      const { startDate, endDate } = getDateRange(quickDate.label);
      setStartDate(startDate);
      setEndDate(endDate);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  }, []);

  if (error) {
    return (
      <Alert 
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
      >
        <Stack>
          {error}
          <Tooltip label="Refresh Account">
            <ActionIcon 
              variant="filled" 
              color="grape"
              onClick={() =>getUsersPaginationGraphql(pagination.page, pagination.limit)}
              loading={loading}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>
        </Stack>
      </Alert>
    );
  }

  return (
    <>
      <Box>
        <Group gap="xs" mb="lg">

          <Tooltip label="New User">
            <ActionIcon
              onClick={() => {
                open();
                setType('register');
              }}
              size='lg'
              style={{ alignSelf: 'flex-end', marginBottom: 2 }}
              disabled={loading}
            >
              <IconUserPlus size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Quick Dates">
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
          </Tooltip>

          <Tooltip label="Start Date">
          <DatePickerInput
            leftSection={<IconCalendar size={18} stroke={1.5} />}
            leftSectionPointerEvents="none"      
            label="Start Date" 
            placeholder="Start date"
            value={startDate}
            onChange={(date) => handleDateRange(date, 'start')}
            clearable
            w="150px"
            valueFormat="DD/MM/YYYY"
            disabled={loading}
            />
          </Tooltip>

          <Tooltip label="End Date">
            <DatePickerInput
              leftSection={<IconCalendar size={18} stroke={1.5} />}
              leftSectionPointerEvents="none"      
              label="End Date" 
              placeholder="End date"
              value={endDate}
              onChange={(date) => handleDateRange(date, 'end')}
              clearable
              w="150px"
              valueFormat="DD/MM/YYYY"
              disabled={loading}
              minDate={startDate ? new Date(startDate) : undefined}
            />
          </Tooltip>

          <Tooltip label="Timezone">
            <Select
              label="Timezone"
              placeholder="Pick timezone"
              data={timezones}
              w="200px"
              value={timezone}
              onChange={(value) => setTimezone(value || '')}
              disabled={loading}
            />
          </Tooltip>

          <Tooltip label="Refresh Data">
            <Button
              onClick={() => getUsersPaginationGraphql(pagination.page, pagination.limit)}
              leftSection={<IconRefresh size={16} />}
              variant="filled"
              loading={loading}
              style={{ alignSelf: 'flex-end' }}
              size='sm'
            >
              Refresh Data
            </Button>
          </Tooltip>

          <ActionIcon.Group style={{ alignSelf: 'flex-end' }}>
            
            <Menu opened={showSearch} openDelay={200} closeDelay={400} 
              withinPortal 
              closeOnItemClick={false} 
              closeOnClickOutside={true}
            >
              <Menu.Target>
                <Tooltip label="Show/Hide Search by name">
                  <ActionIcon
                    variant='outline'
                    size='lg'
                    onClick={() => setShowSearch(!showSearch)}
                    disabled={loading}
                  >
                    <IconSearch size={16} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <TextInput
                    label="Search by name"
                    placeholder="Search here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={loading}
                  />
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            
            <Tooltip label="Print">
              <ActionIcon
                onClick={() => handlePrint(columns, computedUsers)}
                variant='outline'
                size='lg'
                disabled={loading}
              >
                <IconPrinter 
                  size={16} 
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Export All Data to CSV">
              <ActionIcon
                onClick={() => handleExportRows(computedUsers)}
                variant='outline'
                size='lg'
                disabled={loading}
              >
                <IconDownload 
                  size={16} 
                />
              </ActionIcon>
            </Tooltip>

            
            <Menu 
              position="bottom-end" 
              withinPortal 
              closeOnItemClick={false} 
              closeOnClickOutside={true}
            >
              <Menu.Target>
                <Tooltip label="Show/Hide Columns">
                  <ActionIcon
                    variant='outline'
                    size='lg'
                    disabled={loading}
                  >
                    <IconColumns size={16} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Toggle Columns</Menu.Label>
                {columnOptions.map((column) => (
                  <Menu.Item
                    key={column.accessor}
                    onChange={() => handleSetHiddenColumn(column.accessor, !column.hidden)}
                    leftSection={
                      <Checkbox
                        icon={CheckboxIcon}
                        checked={!column.hidden}
                        size="xs"
                        onChange={() => handleSetHiddenColumn(column.accessor, !column.hidden)}
                      />
                    }
                  >
                    {column.name}
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Menu.Item
                  onClick={() => handleColumnVisibility(false)}
                  leftSection={<IconEye size={16} />}
                >
                  Show All
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleColumnVisibility(true)}
                  leftSection={<IconEyeOff size={16} />}
                >
                  Hide All
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Menu
              position="bottom-end" 
              withinPortal 
              closeOnItemClick={false} 
              closeOnClickOutside={true}
            >
              <Menu.Target>
                <Tooltip label="Show/Hide Filter">
                  <ActionIcon 
                    variant='outline' 
                    size='lg' 
                    disabled={loading}
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Toggle Filter</Menu.Label>
                {
                  columnOptions
                    .filter(column => column.accessor !== 'actions')
                    .map((column) => (
                      <Menu.Item 
                        key={column.accessor}
                        onClick={() => handleSetFilterColumn(column.accessor, !column.filter)}
                      >
                        <Checkbox
                          label={column.name}
                          checked={column.filter}
                          onChange={() => handleSetFilterColumn(column.accessor, !column.filter)}
                        />
                      </Menu.Item>
                  ))
                }
              </Menu.Dropdown>
            </Menu>

            <Tooltip label="Statistics">
              <ActionIcon
                size='lg'
                variant='outline'
                disabled={loading}
              >
                <IconChartDots2 size={16} />
              </ActionIcon>
            </Tooltip>

          </ActionIcon.Group>

        </Group>
      </Box>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <DataTable
            height={500}
            withTableBorder
            borderRadius="lg"
            striped='even'
            highlightOnHover={true}
            fetching={loading}
            loadingText='Loading...'
            noRecordsText='No records found'
            records={computedUsers}
            columns={columns}
            totalRecords={pagination.total}
            recordsPerPage={pagination.limit}
            page={pagination.page}
            onPageChange={(p) => setPage(p)}
            classNames={{
              root: classes.root,
              pagination: classes.pagination,
            }}    
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <AccountChartByRegisterType />
        </Grid.Col>
      </Grid>

      <AccountDrawer
        isOpen={opened && type !== 'delete'}
        onClose={close}
        type={type}
        userId={userId}
      />

      <AccountTableModal
        opened={opened && type === 'delete'}
        onClose={close}
        type={type}
        userId={userId || undefined}
      />

      {/* {(opened && type !== 'delete') && (
        <AccountDrawer
          key={type}
          isOpen={opened}
          onClose={close}
          type={type}
          userId={userId}
        />
      )}
      {(opened && type === 'delete') && (
        <AccountTableModal
          opened={opened}
          onClose={close}
          type={type}
          userId={userId || undefined}
        />
      )} */}

    </>
  )
}

const handlePrint = (columns: any, users: any) => { // eslint-disable-line
  const printWindow = window.open('', '_blank');

  if (printWindow) {

    const columnHeaders = columns
      .filter((col: any) => col.title !== 'Actions') // eslint-disable-line
      .map((col: any) => ({ // eslint-disable-line
        header: col.title,
        key: col.accessor
      }));
    const printData = users.map((user: any) => user); // eslint-disable-line

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
                ${columnHeaders.map((col: any) => // eslint-disable-line
                  `<th>${col.header}</th>`
                ).join('')}
              </tr>
            </thead>
            <tbody>
              ${printData.map((row: any) => // eslint-disable-line
                `
                <tr>
                  ${columnHeaders.map((col: any) => { // eslint-disable-line
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
}