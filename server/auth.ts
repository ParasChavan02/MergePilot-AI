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
      checks: ["state"],
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
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.id = user.id;
      }

      if (account) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }

        const resolvedUserId = (user?.id ?? token.id ?? token.sub) as string | undefined;

        if (resolvedUserId && account.provider && account.providerAccountId) {
          try {
            await db
              .insert(accounts)
              .values({
                userId: resolvedUserId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token ?? null,
                refresh_token: account.refresh_token ?? null,
                expires_at: account.expires_at ?? null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
                session_state: (account.session_state as string) ?? null
              })
              .onConflictDoUpdate({
                target: [accounts.provider, accounts.providerAccountId],
                set: {
                  userId: resolvedUserId,
                  access_token: account.access_token ?? null,
                  refresh_token: account.refresh_token ?? null,
                  expires_at: account.expires_at ?? null,
                  token_type: account.token_type ?? null,
                  scope: account.scope ?? null,
                  id_token: account.id_token ?? null,
                  session_state: (account.session_state as string) ?? null
                }
              });
          } catch (error) {
            console.error("Failed to persist OAuth account tokens:", error);
          }
        }
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id as string;
        }
        if (token.accessToken) {
          session.accessToken = token.accessToken as string;
        }
      }

      return session;
    }
  }
});
