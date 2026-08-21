import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { env } from "@/config/env";
import { db } from "@/server/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter,

  session: {
    strategy: "database"
  },

  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,

      authorization: {
        params: {
          scope: "read:user user:email repo"
        }
      }
    })
  ],

  pages: {
    signIn: "/login"
  },

  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    }
  }
});