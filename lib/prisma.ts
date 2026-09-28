
import "dotenv/config";

import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPostgresAdapter({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}