export const publicRoutes = [
  "/",
];

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  // "/api/reports",
  // "/api/graphql",
];

export const apiAuthPrefix = "/api/auth";

/**
 * Default routes once login is verified
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";