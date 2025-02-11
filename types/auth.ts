import { UserRole } from '@prisma/client';

export type Tlogin = { 
  email: string, 
  password: string 
};

export type Tregister = { 
  name: string, 
  email: string, 
  password: string, 
  role: UserRole,
  timezone: string
};

export type Tprofile = { 
  name: string, 
  email: string, 
  image?: string, 
  role?: UserRole,
  timezone?: string
};