import { HtmlOptions } from "@elysiajs/html";

export const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <html lang="en">
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <h1>Hello World</h1>
        {children}
      </body>
    </html>
  );
};
