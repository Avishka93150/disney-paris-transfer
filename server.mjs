#!/usr/bin/env node
/**
 * Production entry point: `npm start`.
 *
 * Reads `.env` from the project root into `process.env`, then starts the
 * server built by `npm run build` (`dist/server/entry.mjs`).
 *
 * The parser is deliberately minimal — `KEY=value` lines, optional quotes, no
 * variable expansion. That last point matters: the admin password hash uses
 * `:` as its separator precisely because a dotenv library would expand a `$`
 * and silently truncate it.
 *
 * Environment variables already set (by pm2, systemd, Docker…) always win over
 * the file.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const envFile = join(root, '.env');

if (existsSync(envFile)) {
  for (const rawLine of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

process.env.HOST ??= '0.0.0.0';
process.env.PORT ??= '3000';

const entry = join(root, 'dist', 'server', 'entry.mjs');
if (!existsSync(entry)) {
  console.error('dist/server/entry.mjs not found — run `npm run build` first.');
  process.exit(1);
}

await import(entry);
console.log(`Disney Paris Transfers listening on http://${process.env.HOST}:${process.env.PORT}`);
