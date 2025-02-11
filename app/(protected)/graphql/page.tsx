'use client';

import { useUserStore } from '@/stores/userStore';
import { TUser } from '@/types/user';
import { Pagination } from '@mantine/core';
import { useEffect, useState } from 'react';

const UsersList = () => {

  const { 
    usersGraphql, 
    loadingGraphql, 
    errorGraphql, 
    getUsersPaginationGraphql,
    paginationGraphql
  } = useUserStore();
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    getUsersPaginationGraphql(page, limit);
  }, [getUsersPaginationGraphql, page, limit]); 

  if (loadingGraphql) return <p>Loading...</p>;
  if (errorGraphql) return <p>Error: {errorGraphql}</p>;

  return (
    <>
      <h1>Users List</h1>
      <ul>
        {usersGraphql.map((user: TUser) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul> 
      <Pagination 
        total={paginationGraphql.totalPages} 
        value={paginationGraphql.page} 
        onChange={setPage} 
      />
    </>
  );
};

export default UsersList;

