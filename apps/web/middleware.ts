import { auth } from "@/server/auth";

export default auth((req) => {
  console.log(
    "MIDDLEWARE:",
    req.nextUrl.pathname,
    "AUTH:",
    !!req.auth?.user,
    "USER:",
    req.auth?.user?.name
  );

  const isDashboardRoute =
    req.nextUrl.pathname.startsWith("/dashboard");

  const isAuthenticated = !!req.auth?.user;

  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.nextUrl.origin);

    loginUrl.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname
    );

    return Response.redirect(loginUrl);
  }

  return undefined;
});

export const config = {
  matcher: ["/dashboard/:path*"]
};