import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { Layout } from "./layout";
import staticPlugin from "@elysiajs/static";
import { ChatRoom, EachMessage } from "./components";

const dataSetup = new Elysia({
  name: "dataSetup",
}).state<{ messages: string[] }>({
  messages: [],
});

const SOCKET_GENERIC_TOPIC = "mx_chat_room";

const app = new Elysia({ name: "app" })
  .use(dataSetup)
  .use(staticPlugin())
  .use(html())
  .ws("/chatroom", {
    open(ws) {
      // ws.raw.subscribe(SOCKET_GENERIC_TOPIC);
      ws.subscribe(SOCKET_GENERIC_TOPIC);
    },
    body: t.Object({
      chatInput: t.String({
        maxLength: 30,
        error: "Please have proper length of message.",
      }),
      HEADERS: t.Object({
        "HX-Request": t.Nullable(t.String()),
        "HX-Trigger": t.Nullable(t.String()),
        "HX-Trigger-Name": t.Nullable(t.String()),
        "HX-Target": t.Nullable(t.String()),
        "HX-Current-URL": t.Nullable(t.String()),
      }),
    }),
    message(ws, { chatInput }: { chatInput: string }) {
      if (!chatInput) return;
      app.store.messages.push(chatInput);

      ws.send(
        // SOCKET_GENERIC_TOPIC,
        <div id="chat_container" hx-swap-oob="beforeend">
          <EachMessage message={chatInput} />
        </div>
      );
    },
  })

  .get("/", ({ store }) => (
    <Layout children={<ChatRoom messages={store.messages} />} />
  ))
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
