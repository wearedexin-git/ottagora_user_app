import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { resolveDbPath } from "@/lib/db-path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const makeClient = () => {
  const dbPath = resolveDbPath();
  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`,
  });
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
