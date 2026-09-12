#!/usr/bin/env node
/**
 * Assembles the ready-to-run deploy tree in `out/` from a finished build:
 *
 *   dist/            the built server and client assets
 *   server.mjs       production entry (reads .env, starts the server)
 *   scripts/         admin:hash tool
 *   package.json     + package-lock.json, so `npm ci --omit=dev` installs
 *                    exactly the runtime dependencies
 *   deploy.sh        Plesk deployment action (from deploy/plesk/)
 *   BUILD            the git commit the tree was built from
 *
 * Used both by `scripts/deploy.mjs` (one-command deploy from a developer's
 * machine) and by `.github/workflows/deploy-branch.yml`, so the two can never
 * drift apart. Run `npm run build` first.
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const OUT = join(ROOT, 'out');

export function assembleDeployTree() {
  if (!existsSync(join(ROOT, 'dist', 'server', 'entry.mjs'))) {
    throw new Error('dist/server/entry.mjs not found — run `npm run build` first.');
  }

  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT);

  for (const entry of ['dist', 'server.mjs', 'scripts', 'package.json', 'package-lock.json']) {
    cpSync(join(ROOT, entry), join(OUT, entry), { recursive: true });
  }
  cpSync(join(ROOT, 'deploy', 'plesk'), OUT, { recursive: true });

  let commit = process.env.GITHUB_SHA ?? '';
  if (!commit) {
    try {
      commit = execSync('git rev-parse HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim();
    } catch {
      commit = 'unknown';
    }
  }
  writeFileSync(join(OUT, 'BUILD'), `${commit}\n`);

  return { out: OUT, commit };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { out, commit } = assembleDeployTree();
  console.log(`Deploy tree assembled in ${out} (build ${commit.slice(0, 7)})`);
}
