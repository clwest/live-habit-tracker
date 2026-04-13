import "dotenv/config";
import { defineConfig } from "prisma/config";

// Lazy datasource url: empty-string fallback keeps `prisma generate` working
// during Vercel builds (DATABASE_URL not required at generate time). At runtime
// schema.prisma's env("DATABASE_URL") is authoritative.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
