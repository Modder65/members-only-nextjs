// Import 'withAuth' from 'next-auth/middleware' for authentication middleware functionality.
import { withAuth } from "next-auth/middleware";

/**
 * This middleware integrates with NextAuth to secure your Next.js application.
 * It automatically handles the authentication state of users navigating your app.
 * When a user attempts to access a protected route (defined in the 'matcher' config),
 * the middleware checks if the user is authenticated.
 * 
 * - If the user is not authenticated, they are redirected to the sign-in page.
 * - If the user is authenticated, they can access the protected route as normal.
 *
 * This setup simplifies the process of protecting certain pages or APIs 
 * based on the user's authentication state.
 */

// Configure and export the middleware using 'withAuth'.
export default withAuth({
  // 'pages' specifies custom page routing related to authentication.
  pages: {
    // Defines the signIn page URL.
    // Here, it's set to the root ("/"), meaning the home page is used as the sign-in page.
    signIn: "/"
  }
});

// Export a separate configuration object for the middleware.
export const config = {
  // 'matcher' specifies which paths the middleware should apply to.
  // Paths not included here will bypass this middleware.
  matcher: [
    // Apply the middleware to all routes under '/users'.
    // ':path*' is a wildcard that matches any route after '/users/'.
    "/users/:path*"
  ]
};
