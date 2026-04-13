import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  // Note: datasource.url intentionally omitted — schema.prisma reads
  // DATABASE_URL lazily so `prisma generate` works at build time without it.
});
