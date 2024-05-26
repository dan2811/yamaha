import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  type User,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type DefaultUser,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { env } from "~/env";
import { db } from "~/server/db";
import { createTable } from "~/server/db/mainSchema";
import type { Role, GoogleProfile } from "./types";
import type { JWT } from "next-auth/jwt";
import { eq } from "drizzle-orm";
import { users } from "./db/schemas";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      phone1: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    // ...other properties
    phone1?: string;
    phone2?: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface JWT extends User {
    exp: number;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  events: {
    async signIn(message) {
      console.log("EVENT: SIGN IN", message);
    },
    async signOut(message) {
      console.log("EVENT: SIGN OUT", message);
    },
    async createUser(message) {
      console.log("EVENT: CREATE USER", message);
    },
    async updateUser(message) {
      console.log("EVENT: UPDATE USER", message);
    },
    async linkAccount(message) {
      console.log("EVENT: LINK ACCOUNT", message);
    },
    async session(message) {
      console.log("EVENT: SESSION", message);
    },
  },
  callbacks: {
    jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        // add extra key/value(s) to the token
        console.log("USER ROLE: ", user.role);
        console.log("JWT TOKEN ROLE: ", token.role);
        token.sub = user.id;
        token.phone = user.phone1;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, token.sub))
          .limit(1);
        // Assign role to session for use in front end
        session.user.role = user?.role ?? "client";
        // Assign role to token for use in middleware to check for admin access
        token.role = user?.role ?? "client";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // creates a new user if one doesn't exist
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          given_name: profile.given_name,
          family_name: profile.family_name,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "client",
        };
      },
    }),
    Email({
      async sendVerificationRequest(params) {
        console.log(params);
        // return await sendVerificationRequest(params);
      },
      type: "email",
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
