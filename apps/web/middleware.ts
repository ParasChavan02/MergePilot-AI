import { middlewareAuth } from "@/server/auth-edge";

export default middlewareAuth((req) => {
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthenticated = !!req.auth?.user;

  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  return undefined;
});

export const config = {
  matcher: ["/dashboard/:path*"]
};
