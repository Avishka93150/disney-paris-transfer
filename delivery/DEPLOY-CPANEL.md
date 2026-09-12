# Deploying on cPanel / o2switch / Plesk ("Node.js application")

> 🇫🇷 Version française : [`DEPLOIEMENT-CPANEL.md`](./DEPLOIEMENT-CPANEL.md)
>
> This guide is for shared hosting with a **"Setup Node.js App"** panel (cPanel with the
> CloudLinux Node.js Selector — o2switch, PlanetHoster, Hostinger… — or Plesk's Node.js
> extension). For a VPS, follow [`INSTALLATION-GUIDE.md`](./INSTALLATION-GUIDE.md) instead.

## How it works

The site is **built by GitHub, not by your hosting**. Every time code lands on the `main`
branch, a GitHub Action compiles the site and publishes the result on a branch called
`deploy`. Your hosting simply pulls that branch, installs the runtime components and
restarts. Nothing heavy ever runs on the shared server.

```
GitHub main ──(Action: build)──▶ GitHub deploy ──(cPanel Git: pull)──▶ your server
```

## Before you start — one thing to check

The site needs **Node.js 22.12 or newer**. In cPanel, open **Setup Node.js App** and look at
the *Node.js version* list. If **22** (or higher) is not offered, ask your host to enable it
before going further — the site cannot run on Node 20 or 18.

## 1. Publish the `deploy` branch (once)

1. Merge the site into `main` on GitHub (or open the **Actions** tab, choose *Build deploy
   branch*, click *Run workflow* and pick the branch you want to publish).
2. Wait for the green tick. A `deploy` branch now exists in the repository.

## 2. Clone it on your hosting

cPanel → **Git™ Version Control** → *Create*:

| Field              | Value                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| Clone a repository | on                                                                    |
| Clone URL          | `https://github.com/Avishka93150/disney-paris-transfer.git`           |
| Repository path    | `disneyparistransfers` (a folder in your home, **not** `public_html`) |
| Repository name    | `disneyparistransfers`                                                |

Then open *Manage* → *Pull or Deploy* → set the **checked-out branch to `deploy`**.

> If the GitHub repository is private, cPanel shows an SSH public key under *Manage* →
> *Basic Information*: add it on GitHub as a *deploy key* on the repository and use the SSH
> clone URL (`git@github.com:Avishka93150/disney-paris-transfer.git`) instead.

## 3. Create the Node.js application

cPanel → **Setup Node.js App** → *Create application*:

| Field                    | Value                                              |
| ------------------------ | -------------------------------------------------- |
| Node.js version          | **22** (or newer)                                  |
| Application mode         | Production                                         |
| Application root         | `disneyparistransfers` (the folder from step 2)    |
| Application URL          | `disneyparistransfers.com`                         |
| Application startup file | `server.mjs`                                       |

Then, in the same screen, add the **environment variables** (button *Add variable*). Copy
them from `.env.example`; the important ones:

| Variable              | Value                                                                        |
| --------------------- | ---------------------------------------------------------------------------- |
| `APP_URL`             | `https://disneyparistransfers.com`                                           |
| `SESSION_SECRET`      | 32+ random characters                                                        |
| `ADMIN_EMAIL`         | your login                                                                   |
| `ADMIN_PASSWORD_HASH` | the line from `npm run admin:hash` (starts with `scrypt:`)                   |
| `DATABASE_PATH`       | `/home/YOUR-CPANEL-USER/disneyparistransfers-data/app.db` — **outside** the repository, so a redeploy can never touch your bookings |
| `SMTP_HOST` … `MAIL_TO` | your mailbox (can also be set later from Admin → Settings)                  |
| `SITE_PHONE`, `SITE_PHONE_DISPLAY`, `SITE_WHATSAPP`, `SITE_EMAIL` | your public contact details |

Click *Create*, then **Run NPM Install**, then **Start App** (or *Restart*).

Open `https://disneyparistransfers.com` — the site is live. Sign in at `/admin`.

> ℹ️ Instead of the panel you can also upload a `.env` file into the application root:
> `server.mjs` reads it at start. Variables set in the panel win over the file.

## 4. Updating the site later

1. Merge the change into `main` on GitHub → the Action rebuilds the `deploy` branch
   (about two minutes).
2. cPanel → **Git™ Version Control** → *Manage* → *Pull or Deploy* → **Update from Remote**,
   then **Deploy HEAD Commit**.

The deploy step runs `deploy.sh`: it installs any new runtime components and restarts the
application. Your database is untouched (it lives outside the repository).

Prefer it fully automatic? In cPanel → **Cron Jobs**, add, for example every 15 minutes:

```
cd ~/disneyparistransfers && git fetch -q origin deploy && [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/deploy)" ] && git reset -q --hard origin/deploy && bash deploy.sh
```

## 5. Backups

Everything is in one file: the `DATABASE_PATH` above. Back it up with cPanel's *Backup*
tool or a cron job such as:

```
0 3 * * * cp ~/disneyparistransfers-data/app.db ~/backups/app-$(date +\%F).db
```

## Troubleshooting

| Symptom                                              | Cause and fix                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Node.js version 22 is not in the list                | Ask the host to enable it. The site does not run on older versions.                                    |
| *Run NPM Install* fails on `better-sqlite3`          | The host blocks the download of the prebuilt module or lacks build tools. Ask support to allow it, or run `npm ci --omit=dev` from the Terminal to see the error. |
| "Incomplete response / 503" when opening the site    | Open the application's log (Setup Node.js App → the app → *stderr.log*). Usually a missing `SESSION_SECRET` or a wrong `DATABASE_PATH` folder permission. |
| The site shows the old version after a deploy        | Click *Restart* in Setup Node.js App, or run `touch ~/disneyparistransfers/tmp/restart.txt`.           |
| Emails are not sent                                  | Fill in the SMTP variables (panel or Admin → Settings). Until then, emails are written to `stderr.log`. |
