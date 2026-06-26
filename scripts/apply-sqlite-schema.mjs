import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";

function loadEnvFile(fileName) {
  const envPath = resolve(process.cwd(), fileName);

  try {
    const envFile = readFileSync(envPath, "utf8");

    for (const line of envFile.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

      if (!match || process.env[match[1]] !== undefined) {
        continue;
      }

      process.env[match[1]] = (match[2] ?? "").replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // Optional env file.
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("DATABASE_URL is missing.");
}

if (url.startsWith("libsql://") && !authToken) {
  throw new Error("TURSO_AUTH_TOKEN is missing.");
}

const sql = readFileSync(
  resolve(process.cwd(), "prisma/migrations/20260625172631_modify/migration.sql"),
  "utf8",
);

const client = createClient({ url, authToken });

await client.execute(sql);
client.close();

console.log("SQLite schema applied successfully.");
