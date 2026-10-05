import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { env } from "@/config/env";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { db } from "@/server/db";

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
  debug: true,
  adapter,
  trustHost: true,
  secret: env.AUTH_SECRET,

  session: {
    strategy: "jwt"
  },

  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      issuer: "https://github.com/login/oauth",
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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }

      return session;
    }
  }
});
