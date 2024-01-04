import { libsql } from "@lucia-auth/adapter-sqlite";
import { github, google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { config } from "../config";
import { client } from "../db";
import { elysia as elysiaMiddlewareForLucia } from "lucia/middleware";

const envAliasMap = {
  production: "PROD",
  development: "DEV",
} as const;

const envAlias = envAliasMap[config.env.NODE_ENV];

type ElysiaContext = {
  request: Request;
  set: {
    headers: Record<string, string> & {
      ["Set-Cookie"]?: string | string[];
    };
    status?: number | undefined | string;
    redirect?: string | undefined;
  };
};

export const auth = lucia({
  env: envAlias,
  middleware: elysiaMiddlewareForLucia(),
  adapter: libsql(client, {
    user: "user",
    key: "user_key",
    session: "user_session",
  }),
  getUserAttributes: (data) => {
    return {
      handle: data.handle,
    };
  },
});

export type Auth = typeof auth;

export const githubAuth = google(auth, {
  clientId: config.env.GOOGLE_CLIENT_ID,
  clientSecret: config.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${config.env.HOST_URL}/api/auth/google/callback`,
});
