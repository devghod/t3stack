import { UserRole } from "@prisma/client";

export type TUser = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password?: string | null;
  role: UserRole;
  timezone: string | null;
  createdAt: Date;
  updatedAt: Date;
}