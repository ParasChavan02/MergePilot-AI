import NextAuth from "next-auth";

import { env } from "@/config/env";

export const { auth: middlewareAuth } = NextAuth({
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  providers: []
});
