// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

/*
 * `.env` is read here so that `process.env` is populated in `astro dev` and
 * `astro build` exactly as it is in production (`server.mjs`). The server code
 * only ever reads `process.env`: nothing is inlined into the bundle, so the
 * client can change a phone number in `.env` and restart, without rebuilding.
 */
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) process.env[key] = value;
}

export default defineConfig({
  site: process.env.APP_URL || 'https://disneyparistransfers.com',
  // Every page is rendered on the server as complete HTML. The public pages are
  // then kept in an in-process cache (see `src/lib/cache.ts`) so they answer as
  // fast as static files while still reflecting the admin's price changes.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'never',
  compressHTML: true,
  // Same port in development and production, so the client's guide has one address.
  server: { port: Number(process.env.PORT ?? 3000) },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Native / Node-only modules must not be bundled.
      external: ['better-sqlite3', 'nodemailer', 'stripe'],
    },
  },
});
