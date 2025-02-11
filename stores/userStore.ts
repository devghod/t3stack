import { StateCreator, create } from 'zustand';
import { Tprofile, Tregister } from '@/types/auth';
import { TUser } from '@/types/user';
import { gql } from '@apollo/client';
import { TReport } from '@/types/report';
import client from '@/lib/apollo-client';
import bcrypt from 'bcryptjs';

type UserStore = {
  users: TUser[];
  usersGraphql: TUser[];
  loading: boolean;
  loadingUser: boolean;
  loadingReport: boolean;
  loadingGraphql: boolean;
  report: TReport[];
  error: string | null;
  errorReport: string | null;
  errorGraphql: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  paginationGraphql: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  getUsers: () => Promise<void>;
  getUsersWithGraphql: () => Promise<void>;
  getUsersPagination: (page: number, limit: number) => Promise<void>;
  getUsersPaginationGraphql: (page: number, limit: number) => Promise<void>;
  getUserById: (id: string) => Promise<TUser | null>;
  getReports: () => Promise<void>;
  createUser: (data: Tregister) => Promise<void>;
  createUserGraphql: (data: Tregister) => Promise<{ message: string; success: boolean }>;
  updateUser: (data: Tprofile, userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  setPage: (page: number) => void;
  setGraphqlError: (error: string) => void;
}

const createUserActions: StateCreator<UserStore> = (set, get) => ({
  users: [],
  usersGraphql: [],
  loading: false,
  loadingUser: false,
  loadingReport: false, 
  loadingGraphql: false,
  report: [],
  error: null,
  errorReport: null,
  errorGraphql: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  paginationGraphql: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },

  // Graphql Start
  setGraphqlError: (error: string) => {
    set({ errorGraphql: error, loadingUser: false });
  },

  createUserGraphql: async (data: Tregister) => {
    set({ loadingUser: true, error: null });
    
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const { data: { addUser } } = await client.mutate({
      mutation: gql`
        mutation AddUser(
          $name: String!, 
          $email: String!, 
          $role: String!, 
          $timezone: String!, 
          $password: String!
        ) {
          addUser(
            name: $name, 
            email: $email, 
            role: $role, 
            timezone: $timezone, 
            password: $password
          ) {
            email
            name
            password
            role
            timezone
          }
        }
      `,
      variables: { 
        name: data.name,
        email: data.email,
        role: data.role,
        timezone: data.timezone,
        password: hashedPassword,
      },
    });

    get().getUsersPaginationGraphql(
      get().pagination.page, 
      get().pagination.limit
    );

    console.log(">> addUser", addUser);

    set({ loadingUser: true });

    return {
      message: 'User created successfully!',
      success: true,
    }
  },

  getUsersPaginationGraphql: async (page, limit) => {
    set({ loading: true, error: null });

    try {
      const { data } = await client.query({
        query: gql`
          query GetUsersPagination($page: Int!, $limit: Int!) {
            getUsersPagination(page: $page, limit: $limit) {
              users {
                id
                name
                email
                role
                timezone
                createdAt
              }
              pagination {
                total
                totalPages
                page
                limit
              }
            }
          }
        `,
        variables: { page, limit },
      });

      set({
        loading: false,
        users: data.getUsersPagination.users,
        pagination: data.getUsersPagination.pagination,
      });
      
    } catch (error) {
      set({ 
        loading: false, 
        error: `Failed to fetch users: ${error}` 
      });
    }
  },

  getUsersWithGraphql: async () => {
    set({ loadingGraphql: true, errorGraphql: null });
    
    const GET_USERS = gql`
      query {
        users {
          id
          name
          email
          role
          timezone
          createdAt
        }
      }
    `;

    const response = await client.query({ query: GET_USERS });
    const { data, error } = response;

    set({ 
      usersGraphql: data.users,
      loadingGraphql: false,  
      errorGraphql: error?.message
    });
  },
  // Graphql End

  getReports: async () => {
    set({ loadingReport: true, errorReport: null });
    const response = await fetch('/api/reports');
    const { success, data, message } = await response.json();

    if (success) {
      set({ 
        loadingReport: false,
        report: data
      });
    } else {
      set({ 
        loadingReport: false,
        errorReport: message
      });
    }
  },

  getUsers: async () => {
    set({ loading: true, error: null });
    const response = await fetch('/api/users');
    const result = await response.json();

    if (result.success) {
      set({ loading: false, users: result.data});
    }
  },

  getUsersPagination: async (
    page: number, 
    limit: number 
  ) => {
    set({ loading: true, error: null });

    const response = await fetch(`/api/users?page=${page}&limit=${limit}`);
    const { success, data, message, pagination } = await response.json();

    if (success) { 
      set({ 
        loading: false, 
        users: data,
        pagination: pagination
      });
    } else {
      set({ 
        loading: false, 
        error: message
      });
    }
  },

  getUserById: async (userId: string) => {
    set({ loadingUser: true, error: null });
    const response = await fetch(`/api/users/${userId}`);
    const result = await response.json();
    set({ loadingUser: false });
    return result;
  },

  createUser: async (data: Tregister) => {
    set({ loadingUser: true, error: null });
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, password: hashedPassword })
    });

    const result = await response.json();

    if (result.success) {
      get().getUsersPagination(
        get().pagination.page, 
        get().pagination.limit
      );
    }

    set({ loadingUser: false });
    
    return result;
  },

  updateUser: async (data: Tprofile, userId: string) => {
    set({ loadingUser: true, error: null });
    
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      set({ 
        loadingUser: false, 
        users: get().users.map(user => user.id === userId ? result.data : user)
      });
    }

    return result;
  },

  deleteUser: async (userId: string) => {
    set({ loadingUser: true, error: null });
    
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      get().getUsersPagination(
        get().pagination.page, 
        get().pagination.limit
      );
    }

    return result;
  },

  setPage: (page: number) => {
    set({ pagination: { ...get().pagination, page } });
  }

});

export const useUserStore = create<UserStore>()((set, get, store) => ({
  ...createUserActions(set, get, store),
}));