import type { NextAuthConfig } from "next-auth";

// Edge-safe subset of the auth config (no database imports).
// Used by middleware.ts so Prisma never runs on Vercel Edge.
// The full config (src/auth.ts) extends this with the Credentials
// provider + authorize() that queries Prisma.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isAuthed = !!auth?.user;
      const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      if (isDashboard && !isAuthed) return false;
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
