/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification"
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const authRoutes = [
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
]

export const registerRoutes = [
  "/auth/register",
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/users";
// Use the one below when testing to finish auth tutorial video
//export const DEFAULT_LOGIN_REDIRECT = "/settings";