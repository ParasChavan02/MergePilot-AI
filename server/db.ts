import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "@/config/env";
import * as schema from "@/db/schema";

const sql = postgres(env.DATABASE_URL, {
  max: 1,
  prepare: false,
  idle_timeout: 20
});

export const db = drizzle(sql, { schema });
