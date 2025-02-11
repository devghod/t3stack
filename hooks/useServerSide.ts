import { auth } from "@/auth";

/**
 * Server function to get the current user
 * @returns The current user
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

/**
 * Server function to get the current user role
 * @returns The current user role
 */
export const currentUserRole = async () => {
  const session = await auth();
  return session?.user?.role;
};