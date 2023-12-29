import { liveReloadScript } from "./liveReloadScript";

export const Layout = ({ children }: { children: JSX.Element }) => {
  const safeScript = liveReloadScript();
  // config.env.NODE_ENV === "development" ? liveReloadScript() : "";

  return (
    <html lang="en">
      <head>
        <title>ChatMX App</title>
        <link rel="stylesheet" href="/public/uncloak.css" />

        <script src="/public/htmx.min.js"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
        />
        <link rel="stylesheet" href="/public/dist/unocss.css" />
        <script>{safeScript}</script>
      </head>
      <body>
        <h1>ChatMX</h1>
        <div>{children}</div>
      </body>
    </html>
  );
};
