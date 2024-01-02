import { liveReloadScript } from "./liveReloadScript";

export const BaseHtml = ({ children }: { children: JSX.Element }) => {
  const safeScript = liveReloadScript();
  // config.env.NODE_ENV === "development" ? liveReloadScript() : "";

  return (
    <html lang="en">
      <head>
        <title>ChatMX App</title>
        <link rel="stylesheet" href="/public/uncloak.css" />

        <script src="/public/htmx.min.js"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/ws.js"></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
        />
        <link rel="stylesheet" href="/public/dist/unocss.css" />
        <script defer>{`htmx.logger = function(elt, event, data) {
            if(console) {
                console.log(event, elt, data);
            }
          }`}</script>
        {/* <script>{safeScript}</script> */}
      </head>
      <body>
        <h1>ChatMX</h1>
        <div>{children}</div>
      </body>
    </html>
  );
};
