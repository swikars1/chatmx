import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { Layout } from "./layout";
import staticPlugin from "@elysiajs/static";
import { ChatRoom, EachMessage } from "./components";
import { config } from "./config";
import pretty from "pino-pretty";
import { logger } from "@bogeychan/elysia-logger";
import { HoltLogger } from "@tlscipher/holt";
import { db } from "./db";

const dataSetup = new Elysia({
  name: "dataSetup",
}).state<{ messages: string[] }>({
  messages: [],
});

const socketHeaderSchema = t.Object({
  "HX-Request": t.Nullable(t.String()),
  "HX-Trigger": t.Nullable(t.String()),
  "HX-Trigger-Name": t.Nullable(t.String()),
  "HX-Target": t.Nullable(t.String()),
  "HX-Current-URL": t.Nullable(t.String()),
});

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

const SOCKET_GENERIC_TOPIC = "mx_chat_room";

const app = new Elysia({ name: "app" })
  .decorate("db", db)
  .decorate("config", config)
  .use(logger(loggerConfig))
  .use(
    // @ts-expect-error
    config.env.NODE_ENV === "development"
      ? new HoltLogger().getLogger()
      : (a) => a
  )
  .use(dataSetup)
  .use(staticPlugin())
  .use(html())
  .get("/", ({ store }) => (
    <Layout children={<ChatRoom messages={store.messages} />} />
  ))
  .ws("/ws/chatroom", {
    open(ws) {
      ws.subscribe(SOCKET_GENERIC_TOPIC);
    },
    body: t.Object({
      chatInput: t.String({
        maxLength: 30,
        error: "Please have proper length of message.",
      }),
      HEADERS: socketHeaderSchema,
    }),
    message(ws, { chatInput }: { chatInput: string }) {
      if (!chatInput) return;

      const msgPayload = (
        <div id="chat_container" hx-swap-oob="beforeend">
          <EachMessage message={chatInput} />
        </div>
      ) as string;
      //send to subscribers
      ws.raw.publishText(SOCKET_GENERIC_TOPIC, msgPayload);
      //send to the sender for htmx swap
      ws.raw.sendText(msgPayload);
      // save in memory
      app.store.messages.push(chatInput);
    },
  })

  .group("/api", (app) =>
    app.post(
      "/message",
      ({ body: { message }, store }) => {
        // store.messages.push(message);
        // app.server?.publish(SOCKET_GENERIC_TOPIC, message);
        // return <EachMessage message={message} />;
      },
      {
        body: t.Object({
          message: t.String({
            maxLength: 30,
            error: "please have proper length of message.",
          }),
        }),
      }
    )
  )

  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
