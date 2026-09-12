# Deploying on Plesk (Node.js application)

> 🇫🇷 Version française : [`DEPLOIEMENT-PLESK.md`](./DEPLOIEMENT-PLESK.md)
>
> This guide is for a server managed with **Plesk** and its Node.js support. For a bare VPS
> without Plesk, follow [`INSTALLATION-GUIDE.md`](./INSTALLATION-GUIDE.md) instead.

## How it works

The site is **built by GitHub, not by your server**. Every time code lands on the `main`
branch, a GitHub Action compiles the site and publishes the result on a branch called
`deploy`. Plesk pulls that branch, installs the runtime components and restarts the
application. Your server never runs the build.

```
GitHub main ──(Action: build)──▶ GitHub deploy ──(Plesk Git: pull)──▶ your server
```

## Before you start — two things to check

1. **Node.js 22 (or newer) is installed in Plesk.** *Tools & Settings → Updates → Add/Remove
   Components → Web hosting → Node.js support*: tick **Node.js 22** (and later versions if
   offered). The site cannot run on Node 20 or 18.
2. The **Git** extension is present (*Websites & Domains → your domain → Git*). It is part
   of Plesk Obsidian; if the icon is missing, install it from *Extensions*.

## 1. Publish the `deploy` branch (once)

1. Merge the site into `main` on GitHub (or open the **Actions** tab, choose *Build deploy
   branch*, click *Run workflow* and pick the branch you want to publish).
2. Wait for the green tick. A `deploy` branch now exists in the repository.

## 2. Pull it with Plesk Git

*Websites & Domains → disneyparistransfers.com → Git → Add Repository*:

| Field                          | Value                                                              |
| ------------------------------ | ------------------------------------------------------------------ |
| Repository                     | Remote Git hosting like GitHub                                     |
| Remote Git repository          | `https://github.com/Avishka93150/disney-paris-transfer.git`        |
| Branch                         | **`deploy`**                                                       |
| Deploy to                      | `/httpdocs` (the default)                                          |
| Deployment mode                | *Automatic* (see step 5) — or *Manual* if you prefer to click      |
| Additional deployment actions  | `bash /var/www/vhosts/disneyparistransfers.com/httpdocs/deploy.sh` |

> If the GitHub repository is private, Plesk shows an SSH public key when you choose the SSH
> URL (`git@github.com:Avishka93150/disney-paris-transfer.git`): add it on GitHub as a
> *deploy key* on the repository.
>
> The deployment action needs the domain's system user to have a real shell: *Websites &
> Domains → Hosting & DNS → Web Hosting Access → Access to the server over SSH*:
> **`/bin/bash`** (not *chrooted*, not *forbidden*). Without it, skip the action and use the
> *NPM install* and *Restart App* buttons of step 3 after each deployment instead.

Click *OK*: Plesk clones the branch into `httpdocs`.

## 3. Enable Node.js on the domain

*Websites & Domains → disneyparistransfers.com → Node.js → Enable Node.js*, then set:

| Field                     | Value                                              |
| ------------------------- | -------------------------------------------------- |
| Node.js version           | **22** (or newer)                                  |
| Package manager           | npm                                                |
| Document root             | `/httpdocs/dist/client` — photos, fonts and scripts are then served straight by the web server |
| Application mode          | production                                         |
| Application root          | `/httpdocs`                                        |
| Application startup file  | `server.mjs`                                       |

Then **Custom environment variables → Specify** and add them (copy from `.env.example`);
the important ones:

| Variable              | Value                                                                        |
| --------------------- | ---------------------------------------------------------------------------- |
| `APP_URL`             | `https://disneyparistransfers.com`                                           |
| `SESSION_SECRET`      | 32+ random characters                                                        |
| `ADMIN_EMAIL`         | your login                                                                   |
| `ADMIN_PASSWORD_HASH` | the line from `npm run admin:hash` (starts with `scrypt:`)                   |
| `DATABASE_PATH`       | `/var/www/vhosts/disneyparistransfers.com/data/app.db` — **outside** `httpdocs`, so a redeploy can never touch your bookings |
| `SMTP_HOST` … `MAIL_TO` | your mailbox (can also be set later from Admin → Settings)                  |
| `SITE_PHONE`, `SITE_PHONE_DISPLAY`, `SITE_WHATSAPP`, `SITE_EMAIL` | your public contact details |

Click *Apply*, then **NPM install** (only needed the first time, or if the deployment
action could not run), then **Restart App**.

Open `https://disneyparistransfers.com` — the site is live. Sign in at `/admin`.

> ℹ️ Instead of the panel you can also place a `.env` file in `httpdocs`: `server.mjs`
> reads it at start. Variables set in Plesk win over the file.

## 4. HTTPS

*Websites & Domains → SSL/TLS Certificates → Let's Encrypt*: issue a certificate for the
domain and `www`, and tick *Redirect from HTTP to HTTPS* in *Hosting Settings*.

## 5. Updating the site later — one command

From the project folder on your own computer:

```bash
npm run deploy
```

That single command checks and builds the site, then delivers it. Which way depends on
two lines in your local `.env` (see `.env.example`, section *Deployment*):

- **`DEPLOY_SSH=user@disneyparistransfers.com`** — the site is copied straight to the
  server and `deploy.sh` runs there (install + restart). Nothing goes through GitHub. The
  user is the domain's system user, with *Access over SSH: /bin/bash* in Plesk, and your
  computer's SSH key added under *Websites & Domains → SSH Access* (or use a password).
  Optional: `DEPLOY_PATH` if the application is not in `httpdocs`.
- **No `DEPLOY_SSH`** — the built site is pushed to the `deploy` branch on GitHub, and if
  `PLESK_WEBHOOK_URL` is set (the *Webhook URL* shown on the repository's Git page in Plesk)
  Plesk is told to pull and restart at once. Without the URL, Plesk pulls on its next
  automatic deployment or when you click *Pull Updates*.

Useful flags: `--skip-check` (skip the type check), `--skip-build` (redeploy the last build),
`--dry-run` (show what would happen), `--method=git` (force the GitHub route even with SSH
configured).

### …or let GitHub do it

Without running anything yourself:

1. Merge the change into `main` on GitHub → the Action rebuilds the `deploy` branch
   (about two minutes).
2. **Automatic mode:** Plesk shows a *Webhook URL* on the repository's page. On GitHub, open
   *Settings → Webhooks → Add webhook*, paste that URL, content type `application/json`,
   event *Just the push event*. From then on every new build deploys itself: Plesk pulls
   `deploy` and runs `deploy.sh`, which installs any new components and restarts the app.
3. **Manual mode:** *Websites & Domains → Git → Pull Updates* (then *NPM install* and
   *Restart App* if the deployment action is not set up).

Your database is untouched either way — it lives outside `httpdocs`.

## 6. Backups

Everything is in one file: the `DATABASE_PATH` above. Include `/data` in Plesk's *Backup
Manager* schedule, or add a *Scheduled Task*:

```
cp /var/www/vhosts/disneyparistransfers.com/data/app.db /var/www/vhosts/disneyparistransfers.com/backups/app-$(date +\%F).db
```

## Troubleshooting

| Symptom                                              | Cause and fix                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Node.js 22 is not in the version list                | Install the *Node.js 22* component (*Tools & Settings → Updates*). The site does not run on older versions. |
| The deployment action fails with "npm not found"     | The system user's shell is *chrooted* or *forbidden*: set it to `/bin/bash`, or use the *NPM install* button. |
| *NPM install* fails on `better-sqlite3`              | The server blocks the download of the prebuilt module or lacks build tools (`gcc`, `make`, `python3`). Install them or allow the download, then retry. |
| "Web application could not be started" / 503        | Open the log: *Node.js → the application → Logs* (`stderr`). Usually a missing `SESSION_SECRET` or a `DATABASE_PATH` folder the system user cannot write to (`chown` it to the domain's user). |
| The site shows the old version after a deploy        | Click *Restart App*, or run `touch /var/www/vhosts/disneyparistransfers.com/httpdocs/tmp/restart.txt`. |
| Photos or fonts return 404                           | *Document root* must be `/httpdocs/dist/client` (step 3).                                              |
| Emails are not sent                                  | Fill in the SMTP variables (panel or Admin → Settings). Until then, emails are written to the app log. |
