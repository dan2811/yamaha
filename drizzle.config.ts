import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  out: "./src/server/db/migrations",
  tablesFilter: ["yamaha_*"],
} satisfies Config;
