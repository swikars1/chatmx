import { logger } from "@bogeychan/elysia-logger";
import cron from "@elysiajs/cron";
import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
import { HoltLogger } from "@tlscipher/holt";
import Elysia from "elysia";
import { config } from "./config";
import { db, client } from "./db";
import pretty from "pino-pretty";
import { auth } from "./auth";

const stream = pretty({
  colorize: true,
});

const loggerConfig =
  config.env.NODE_ENV === "development"
    ? {
        level: config.env.LOG_LEVEL,
        stream,
      }
    : { level: config.env.LOG_LEVEL };

export const ctx = new Elysia({ name: "initial_ctx_setup" })
  .decorate("db", db)
  .decorate("config", config)
  .decorate("auth", auth)
  .state<{ messages: string[] }>({
    messages: [],
  })
  .use(logger(loggerConfig))
  .use(
    // @ts-expect-error
    config.env.NODE_ENV === "development"
      ? new HoltLogger().getLogger()
      : (a) => a
  )
  .use(
    // @ts-expect-error
    config.env.DATABASE_CONNECTION_TYPE === "local-replica"
      ? cron({
          name: "heartbeat",
          pattern: "*/2 * * * * *",
          run() {
            const now = performance.now();
            console.log("Syncing database...");
            void client.sync().then(() => {
              console.log(`Database synced in ${performance.now() - now}ms`);
            });
          },
        })
      : (a) => a
  )
  .onResponse(({ log, request, set }) => {
    if (log && config.env.NODE_ENV === "production") {
      log.debug(`Response sent: ${request.method}: ${request.url}`);
    }
  })
  .onError(({ log, error }) => {
    if (log && config.env.NODE_ENV === "production") {
      log.error(error);
    }
  });
