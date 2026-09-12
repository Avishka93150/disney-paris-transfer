# Deploying on the Plesk server — `deploy.sh`

> 🇫🇷 Version française : [`DEPLOIEMENT-PLESK.md`](./DEPLOIEMENT-PLESK.md)
>
> For the server at **151.80.21.79** managed with Plesk, serving `disneyparistransfers.com`.
> For a server without Plesk, see [`INSTALLATION-GUIDE.md`](./INSTALLATION-GUIDE.md).

One script does everything, first deployment and every update alike: `deploy.sh`, at the
root of the project. You run it from the terminal built into Plesk.

## Before the first deployment — one thing to check

The site needs **Node.js 22 (or newer)**. In Plesk: *Tools & Settings → Updates →
Add/Remove Components → Web hosting → Node.js support*: tick **Node.js 22**. The script
stops with a clear message if it is missing.

## First deployment (5 minutes)

1. In Plesk, open **Tools & Settings → SSH Terminal** (you are `root` there). If the
   *SSH Terminal* icon is missing, install the free extension of that name from
   *Extensions*, or connect with any SSH client as `root@151.80.21.79`.
2. Paste this line and press Enter:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/Avishka93150/disney-paris-transfer/main/deploy.sh | bash
   ```

3. The script asks two questions — the **email** and **password** for the back office
   (leave the password empty and it generates one, shown at the end). Everything else is
   automatic:

   - the code is downloaded from GitHub into `/var/www/vhosts/disneyparistransfers.com/httpdocs`.
     Whatever was in that folder before is moved to `httpdocs.before-<date>`, and if it was
     the previous version of this site, its **bookings database and `.env` are carried
     over**;
   - a `.env` is created (secret key, admin login, database in
     `/var/www/vhosts/disneyparistransfers.com/data/app.db` — outside the code folder, so a
     redeploy can never touch it);
   - the site is installed and built;
   - the Node.js application is configured in Plesk and started.

4. Read the final lines: the script prints the admin password if it generated one, and
   says whether `https://disneyparistransfers.com/en` answers. If it does not yet, check
   the settings in the next section and click *Restart App*.

> 🔒 The previous site is not deleted, only moved aside. Delete `httpdocs.before-<date>`
> yourself once the new site is confirmed working.

## The Node.js application in Plesk

The script sets these itself when it runs as `root`. If it could not (it says so), set
them in *Websites & Domains → disneyparistransfers.com → Node.js*:

| Field                    | Value                                         |
| ------------------------ | --------------------------------------------- |
| Node.js version          | **22** (or newer)                             |
| Application mode         | production                                    |
| Application root         | `/httpdocs`                                   |
| Document root            | `/httpdocs/dist/client`                       |
| Application startup file | `server.mjs`                                  |

No environment variables are needed in the panel: the site reads
`httpdocs/.env`. Then *Enable Node.js* (first time) or *Restart App*.

**HTTPS:** *Websites & Domains → SSL/TLS Certificates → Let's Encrypt*, for the domain and
`www`, and tick *Redirect from HTTP to HTTPS* in *Hosting Settings*. (Probably already in
place if the domain was live before.)

## Every update afterwards — one command

Open the Plesk terminal and run:

```bash
bash /var/www/vhosts/disneyparistransfers.com/httpdocs/deploy.sh
```

It fetches the latest code from GitHub (`main`), rebuilds, restarts. About one minute.
Your `.env` and your bookings are untouched.

To deploy a specific branch (a pull request you want to try before merging):

```bash
BRANCH=name-of-the-branch bash /var/www/vhosts/disneyparistransfers.com/httpdocs/deploy.sh
```

## Settings

- **Mailbox, Stripe, phone number:** edit `httpdocs/.env` (see `.env.example`), then
  *Restart App* — or, for SMTP and Stripe, use *Admin → Settings*, which needs no restart.
- **Prices, night hours, packages, add-ons:** the back office, live immediately.

## Backups

Everything is in one file: `/var/www/vhosts/disneyparistransfers.com/data/app.db`. Include
the `data` folder in Plesk's *Backup Manager* schedule, or add a *Scheduled Task*:

```
cp /var/www/vhosts/disneyparistransfers.com/data/app.db /var/www/vhosts/disneyparistransfers.com/backups/app-$(date +\%F).db
```

## Troubleshooting

| Symptom                                              | Cause and fix                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| "Node.js not found" / "too old"                      | Install the *Node.js 22* component (*Tools & Settings → Updates*), run the script again.               |
| `npm ci` fails on `better-sqlite3`                   | The server lacks build tools or blocks the module download. `apt install build-essential python3` (Ubuntu/Debian) or `dnf groupinstall "Development Tools"` (AlmaLinux), then run the script again. |
| "Web application could not be started" / 503        | *Node.js → Logs* (`stderr`). Usually the Node.js settings above (startup file, application root) or a wrong document root. |
| The site shows the old version                       | Click *Restart App*, or `touch /var/www/vhosts/disneyparistransfers.com/httpdocs/tmp/restart.txt`.     |
| Photos or fonts return 404                           | *Document root* must be `/httpdocs/dist/client`.                                                       |
| Emails are not sent                                  | Fill in the SMTP settings (`.env` or Admin → Settings). Until then, emails are written to the app log. |
| Lost the admin password                              | On the server: `cd /var/www/vhosts/disneyparistransfers.com/httpdocs && npm run admin:hash -- 'new-password'`, paste the printed `ADMIN_PASSWORD_HASH=` line into `.env`, *Restart App*. |
