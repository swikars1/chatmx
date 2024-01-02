import { Elysia, t } from "elysia";
import { BaseHtml } from "./BaseHtml";
import { ChatRoom, EachMessage } from "./components";
import staticPlugin from "@elysiajs/static";
import { html } from "@elysiajs/html";
import { ctx } from "./ctx";

const socketHeaderSchema = t.Object({
  "HX-Request": t.Nullable(t.String()),
  "HX-Trigger": t.Nullable(t.String()),
  "HX-Trigger-Name": t.Nullable(t.String()),
  "HX-Target": t.Nullable(t.String()),
  "HX-Current-URL": t.Nullable(t.String()),
});
const SOCKET_GENERIC_TOPIC = "mx_chat_room";

const app = new Elysia({ name: "main_app" })
  .use(ctx)
  .use(staticPlugin())
  .use(html())
  .get("/", ({ store }) => (
    <BaseHtml children={<ChatRoom messages={store.messages} />} />
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
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
