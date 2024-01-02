import { createClient, type Config } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { config } from "./config";

const { DATABASE_CONNECTION_TYPE } = config.env;

const options = {
  local: { url: "file:local.sqlite" },
  remote: {
    url: config.env.TURSO_DATABASE_URL,
    authToken: config.env.TURSO_AUTH_TOKEN!,
  },
  "local-replica": {
    url: "file:local.sqlite",
    syncUrl: config.env.TURSO_DATABASE_URL,
    authToken: config.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Record<typeof DATABASE_CONNECTION_TYPE, Config>;

export const client = createClient(options[DATABASE_CONNECTION_TYPE]);

if (config.env.DATABASE_CONNECTION_TYPE === "local-replica") {
  await client.sync();
}

export const db = drizzle(client, { schema, logger: true });
