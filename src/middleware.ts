import type { Role } from "./server/types";
import { withAuth } from "next-auth/middleware";

export const rolesAllowedToAdminPaths: Role[] = [
  "teacher",
  "admin",
  "superAdmin",
];

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      if (!token) {
        console.log("NO_TOKEN_FOUND");
        return false;
      }
      // Check if the middleware is processing the
      // route which requires a specific role
      const path = req.nextUrl.pathname;
      console.debug("USER_VISITING_PATH", {
        user: token,
        requestedPath: path,
      });
      if (path.startsWith("/admin")) {
        if (rolesAllowedToAdminPaths.includes(token.role)) {
          console.info("ADMIN_ACCESS_GRANTED", { user: token });
          return true;
        } else {
          console.warn("ADMIN_ACCESS_DENIED", { user: token });
          return false;
        }
      }

      if (path.startsWith("/profile")) {
        return true;
      }
      console.log("DENYING ACCESS TO PATH", path);
      return false;
    },
  },
});

// Define paths for which the middleware will run
export const config = {
  matcher: ["/profile", "/admin/:path*"],
};
