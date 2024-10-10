import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from ".";
import path from "path";

try {
  await migrate(db, { migrationsFolder: path.join(__dirname, "migrations") });
} catch (e) {
  console.error(e);
  process.exit(1);
}
console.log("Migrations ran successfully");
process.exit(0);
