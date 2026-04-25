import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadEnv } from "dotenv";

// Ensure DATABASE_URL is available even when a service loads only its own .env file.
loadEnv({ path: new URL("../.env", import.meta.url).pathname });

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const datasourceUrl = process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error(
    "Missing DATABASE_URL for @repo/product-db. Set DATABASE_URL or create packages/product-db/.env."
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(datasourceUrl),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;