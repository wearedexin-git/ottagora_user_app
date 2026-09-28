/**
 * DEPRECATO — Non eseguire.
 * I dati di test si creano dal backoffice (manuale o `npm run db:seed-giro`).
 * Vedi: ../doc/flusso_integrazione_backoffice_user_app.md
 */

throw new Error(
  "Seed user app disabilitato. Usare il backoffice per popolare i dati di test."
);

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding data...");
  // ...
}
