#!/usr/bin/env node
/**
 * One-command deploy:   npm run deploy
 *
 * 1. checks and builds the site on this machine;
 * 2. assembles the ready-to-run tree in out/ (scripts/assemble-deploy.mjs);
 * 3. delivers it to the Plesk server, by one of two methods:
 *
 *    ssh  (when DEPLOY_SSH is set)   Copies out/ straight to the server with
 *         tar over ssh, then runs deploy.sh there (npm ci --omit=dev + restart).
 *         Nothing goes through GitHub. Needs an SSH login on the Plesk server —
 *         the domain's system user with "Access over SSH: /bin/bash".
 *
 *    git  (otherwise)                 Force-pushes out/ to the `deploy` branch of
 *         the GitHub repository, then POSTs to PLESK_WEBHOOK_URL (if set) so
 *         Plesk pulls and restarts at once. Same result as a merge to main,
 *         without waiting for the Action.
 *
 * Settings are read from .env (or the environment):
 *
 *    DEPLOY_SSH=disneyparistransfers.com_user@disneyparistransfers.com
 *    DEPLOY_PATH=/var/www/vhosts/disneyparistransfers.com/httpdocs   (default)
 *    PLESK_WEBHOOK_URL=https://…:8443/modules/git/public/web-hook.php?uuid=…
 *    DEPLOY_GIT_REMOTE=origin                                          (default)
 *
 * Flags:  --method=ssh|git   --skip-check   --skip-build   --dry-run
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { assembleDeployTree, OUT, ROOT } from './assemble-deploy.mjs';

/* ── Settings ────────────────────────────────────────────────────────────── */

function loadDotEnv() {
  const file = join(ROOT, '.env');
  if (!existsSync(file)) return;
  for (const rawLine of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv();

const args = new Set(process.argv.slice(2));
const flag = (name) => args.has(`--${name}`);
const option = (name) => [...args].find((a) => a.startsWith(`--${name}=`))?.split('=')[1];

const settings = {
  ssh: process.env.DEPLOY_SSH?.trim() ?? '',
  path: (process.env.DEPLOY_PATH?.trim() || '/var/www/vhosts/disneyparistransfers.com/httpdocs').replace(/\/$/, ''),
  webhook: process.env.PLESK_WEBHOOK_URL?.trim() ?? '',
  remote: process.env.DEPLOY_GIT_REMOTE?.trim() || 'origin',
  branch: 'deploy',
};
const method = option('method') ?? (settings.ssh ? 'ssh' : 'git');
const dryRun = flag('dry-run');

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const isWindows = process.platform === 'win32';
const npm = isWindows ? 'npm.cmd' : 'npm';

function step(title) {
  console.log(`\n▶ ${title}`);
}

function run(command, cmdArgs = [], opts = {}) {
  const shown = [command, ...cmdArgs].join(' ');
  if (dryRun) {
    console.log(`  (dry run) ${shown}`);
    return;
  }
  const result = spawnSync(command, cmdArgs, { stdio: 'inherit', cwd: ROOT, ...opts });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`"${shown}" exited with code ${result.status}`);
  }
}

/** A shell pipeline, for `tar … | ssh …` (works in bash, zsh and cmd.exe). */
function pipeline(command) {
  if (dryRun) {
    console.log(`  (dry run) ${command}`);
    return;
  }
  const result = spawnSync(command, { stdio: 'inherit', cwd: ROOT, shell: true });
  if (result.status !== 0) throw new Error(`pipeline failed with code ${result.status}`);
}

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

/* ── 1 + 2. Check, build, assemble ───────────────────────────────────────── */

if (!flag('skip-build')) {
  if (!flag('skip-check')) {
    step('Type check (npm run check)');
    run(npm, ['run', 'check']);
  }
  step('Build (npm run build)');
  run(npm, ['run', 'build']);
}

step('Assemble the deploy tree');
let commit = 'unknown';
if (!dryRun) {
  ({ commit } = assembleDeployTree());
  console.log(`  out/ ready (build ${commit.slice(0, 7)})`);
}

/* ── 3. Deliver ──────────────────────────────────────────────────────────── */

if (method === 'ssh') {
  if (!settings.ssh) fail('DEPLOY_SSH is not set (e.g. DEPLOY_SSH=user@disneyparistransfers.com in .env).');

  const remote = settings.ssh;
  const path = settings.path;
  step(`Upload to ${remote}:${path}`);
  // Replace dist/ wholesale so stale hashed assets do not accumulate; keep
  // node_modules, tmp/ and anything else that lives there.
  pipeline(
    `tar -C "${OUT}" -czf - . | ssh ${remote} "mkdir -p '${path}' && rm -rf '${path}/dist' && tar -C '${path}' -xzf -"`,
  );

  step('Install runtime dependencies and restart (deploy.sh on the server)');
  run('ssh', [remote, `bash '${path}/deploy.sh'`]);
} else if (method === 'git') {
  step(`Push the deploy tree to ${settings.remote}/${settings.branch}`);
  let remoteUrl = settings.remote;
  if (!/^(https?:|git@|ssh:|file:|\/)/.test(remoteUrl)) {
    const result = spawnSync('git', ['remote', 'get-url', settings.remote], { cwd: ROOT, encoding: 'utf8' });
    if (result.status !== 0) fail(`git remote "${settings.remote}" not found.`);
    remoteUrl = result.stdout.trim();
  }
  const git = (...gitArgs) => run('git', gitArgs, { cwd: OUT });
  if (!dryRun) rmSync(join(OUT, '.git'), { recursive: true, force: true });
  git('init', '-q', '-b', settings.branch);
  git('add', '-A');
  git('-c', 'user.name=deploy', '-c', 'user.email=deploy@disneyparistransfers.com', 'commit', '-q', '-m', `Build ${commit.slice(0, 7)}`);
  git('push', '--force', remoteUrl, `HEAD:${settings.branch}`);

  if (settings.webhook) {
    step('Ask Plesk to pull and restart (PLESK_WEBHOOK_URL)');
    if (!dryRun) {
      const response = await fetch(settings.webhook, { method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json' } });
      console.log(`  Plesk answered ${response.status}`);
      if (!response.ok) fail('Plesk did not accept the webhook call — pull manually from Websites & Domains → Git.');
    }
  } else {
    console.log('  PLESK_WEBHOOK_URL is not set: Plesk will pull on its next automatic deployment, or click "Pull Updates" in Websites & Domains → Git.');
  }
} else {
  fail(`Unknown method "${method}" — use --method=ssh or --method=git.`);
}

console.log(`\n✔ Deployed build ${commit.slice(0, 7)} via ${method}.`);
