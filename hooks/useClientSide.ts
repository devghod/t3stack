import { useSession } from "next-auth/react"

/**
 * Client hook to get the current user role
 * @returns The current user role
 */
export const useCurrentUserRole = () => {
  const session = useSession();

  return session.data?.user?.role;
}

/**
 * Client hook to get the current user
 * @returns The current user
 */
export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
}