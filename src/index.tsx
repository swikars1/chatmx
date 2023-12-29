import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { Layout } from "./layout";
import staticPlugin from "@elysiajs/static";

const dataSetup = new Elysia({
  name: "dataSetup",
}).state<{ messages: string[] }>({
  messages: [],
});

const app = new Elysia({ name: "app" })
  .use(dataSetup)
  .use(staticPlugin())
  .use(html())

  .get("/", ({ store }) =>
    Layout({
      children: (
        <div>
          <h1>hello! Its chat mx</h1>
          <div id="chat_container">
            <h2>chat will come here</h2>
            {store.messages?.length > 0 &&
              store.messages.map((each_msg) => (
                <div safe id="each_message">
                  {each_msg}
                </div>
              ))}
          </div>
          <form
            hx-post="/api/message"
            hx-select-oob="#chat_container:beforeend"
            hx-swap="beforeend"
          >
            <input
              id="input_message"
              type="text"
              name="message"
              placeholder="write message.."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ),
    })
  )
  .group("/api", (app) =>
    app.post(
      "/message",
      ({ body: { message }, store }) => {
        store.messages.push(message);
        return (
          <div id="chat_container">
            <div safe id="each_message">
              {message}
            </div>
          </div>
        );
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
