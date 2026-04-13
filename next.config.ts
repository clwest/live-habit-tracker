import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma's query engine out of the bundler so it can locate its
  // native binary at runtime on Vercel.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
