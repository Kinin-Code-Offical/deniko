import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Global definition for Prisma to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * The shared Prisma Client instance.
 * Uses a global variable in development to prevent exhausting database connections.
 */
export const db =
  globalForPrisma.prisma ??
  (() => {
    const connectionString = env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  })();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;