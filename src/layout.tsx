import { HtmlOptions } from "@elysiajs/html";

export const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <html lang="en">
      <head>
        <title>ChatMX App</title>
        <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
        <script src="/public/htmx.min.js"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
        />
      </head>
      <body>
        <h1>ChatMX</h1>
        <div>{children}</div>
      </body>
    </html>
  );
};
