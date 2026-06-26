import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import {
  Prisma,
  PrismaClient as PrismaClientBase,
} from "@/lib/generated/prisma/client";
import type { PrismaClient as PrismaClientType } from "@/lib/generated/prisma/client";

const PrismaClient = PrismaClientBase as unknown as new (
  options: Prisma.PrismaClientOptions,
) => PrismaClientType;

type PrismaAdapter = NonNullable<Prisma.PrismaClientOptions["adapter"]>;

let databaseReadyPromise: Promise<void> | null = null;

function getDatabaseConfig() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  if (!url) {
    throw new Error("DATABASE_URL is missing in .env.local");
  }

  return {
    url,
    authToken,
  };
}

function createPrismaAdapter(): PrismaAdapter {
  const { url, authToken } = getDatabaseConfig();

  return new PrismaLibSql({
    url,
    authToken,
  });
}

export async function ensureDatabase() {
  if (!databaseReadyPromise) {
    databaseReadyPromise = (async () => {
      const client = createClient(getDatabaseConfig());

      await client.execute(`
        CREATE TABLE IF NOT EXISTS "Preorder" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "products" INTEGER NOT NULL DEFAULT 1,
          "preorderWhen" TEXT NOT NULL,
          "startsAt" DATETIME NOT NULL,
          "endsAt" DATETIME,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )
      `);

      client.close();
    })();
  }

  return databaseReadyPromise;
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientType;
};

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: createPrismaAdapter(),
    });
  }

  return globalForPrisma.prisma;
}
