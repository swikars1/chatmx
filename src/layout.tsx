import { HtmlOptions } from "@elysiajs/html";

export const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <html lang="en">
      <head>
        <title>ChatMX App</title>
        <script src="/public/htmx.min.js"></script>
      </head>
      <body>
        <h1>ChatMX</h1>
        <div>{children}</div>
      </body>
    </html>
  );
};
