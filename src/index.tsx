import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { Layout } from "./layout";
import staticPlugin from "@elysiajs/static";
import { EachMessage } from "./components";

const dataSetup = new Elysia({
  name: "dataSetup",
}).state<{ messages: string[] }>({
  messages: [],
});

const app = new Elysia({ name: "app" })
  .use(dataSetup)
  .use(staticPlugin())
  .use(html())

  .get("/", ({ store }) => (
    <Layout
      children={
        <div>
          <h1 class="">hello! Its chat mx</h1>
          <div id="chat_container">
            <h2>Chats will appear here...</h2>
            {store.messages?.length > 0 &&
              store.messages.map((each_msg) => (
                <EachMessage message={each_msg} />
              ))}
          </div>
          <form
            hx-post="/api/message"
            hx-target="#chat_container"
            hx-swap="beforeend"
            _="on submit target.reset()"
          >
            <input
              class="border px-2 py-1"
              id="input_message"
              type="text"
              name="message"
              placeholder="write message.."
            />
            <button class="px-3 py-1 rounded border" type="submit">
              Send
            </button>
          </form>
        </div>
      }
    />
  ))
  .group("/api", (app) =>
    app.post(
      "/message",
      ({ body: { message }, store }) => {
        store.messages.push(message);
        return <EachMessage message={message} />;
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
