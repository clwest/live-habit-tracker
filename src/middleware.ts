import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-safe middleware: uses authConfig (no Prisma) only.
export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  // Redirect logic is handled in authConfig.callbacks.authorized —
  // this function just lets NextAuth short-circuit to /signin when false.
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const url = new URL("/signin", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
