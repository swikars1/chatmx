import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { Layout } from "./layout";

const app = new Elysia()
  .use(html())
  .get(
    "/html",
    () => `
            <html lang='en'>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    <h1>Hello World</h1>
                </body>
            </html>`
  )
  .get(
    "/jsx",
    ({ query: { title } }) =>
      Layout({ children: <h1>hello from children and title is {title}</h1> }),
    {
      query: t.Object({
        title: t.String(),
      }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
