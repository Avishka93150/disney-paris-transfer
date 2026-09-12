# Mise en ligne sur cPanel / o2switch / Plesk (« application Node.js »)

> 🇬🇧 English version: [`DEPLOY-CPANEL.md`](./DEPLOY-CPANEL.md)
>
> Ce guide concerne les hébergements mutualisés disposant d'un panneau **« Setup Node.js
> App »** (cPanel avec le sélecteur Node.js de CloudLinux — o2switch, PlanetHoster,
> Hostinger… — ou l'extension Node.js de Plesk). Pour un VPS, suivez plutôt
> [`GUIDE-INSTALLATION.md`](./GUIDE-INSTALLATION.md).

## Le principe

Le site est **compilé par GitHub, pas par votre hébergement**. À chaque fois que du code
arrive sur la branche `main`, une action GitHub compile le site et publie le résultat sur une
branche nommée `deploy`. Votre hébergement se contente de récupérer cette branche,
d'installer les composants nécessaires et de redémarrer. Rien de lourd ne tourne jamais sur
le serveur mutualisé.

```
GitHub main ──(Action : compilation)──▶ GitHub deploy ──(Git cPanel : pull)──▶ votre serveur
```

## Avant de commencer — une chose à vérifier

Le site a besoin de **Node.js 22.12 ou plus récent**. Dans cPanel, ouvrez **Setup Node.js
App** et regardez la liste *Node.js version*. Si la version **22** (ou plus) n'est pas
proposée, demandez à votre hébergeur de l'activer avant d'aller plus loin — le site ne peut
pas fonctionner avec Node 20 ou 18.

## 1. Publier la branche `deploy` (une seule fois)

1. Fusionnez le site dans `main` sur GitHub (ou ouvrez l'onglet **Actions**, choisissez
   *Build deploy branch*, cliquez *Run workflow* et choisissez la branche à publier).
2. Attendez la coche verte. Une branche `deploy` existe maintenant dans le dépôt.

## 2. La cloner sur votre hébergement

cPanel → **Git™ Version Control** → *Create* :

| Champ              | Valeur                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| Clone a repository | activé                                                                     |
| Clone URL          | `https://github.com/Avishka93150/disney-paris-transfer.git`                |
| Repository path    | `disneyparistransfers` (un dossier de votre espace, **pas** `public_html`) |
| Repository name    | `disneyparistransfers`                                                     |

Puis *Manage* → *Pull or Deploy* → réglez la **branche suivie sur `deploy`**.

> Si le dépôt GitHub est privé, cPanel affiche une clé publique SSH dans *Manage* →
> *Basic Information* : ajoutez-la sur GitHub comme *deploy key* du dépôt et utilisez
> l'URL SSH (`git@github.com:Avishka93150/disney-paris-transfer.git`) à la place.

## 3. Créer l'application Node.js

cPanel → **Setup Node.js App** → *Create application* :

| Champ                    | Valeur                                              |
| ------------------------ | --------------------------------------------------- |
| Node.js version          | **22** (ou plus récent)                             |
| Application mode         | Production                                          |
| Application root         | `disneyparistransfers` (le dossier de l'étape 2)    |
| Application URL          | `disneyparistransfers.com`                          |
| Application startup file | `server.mjs`                                        |

Ensuite, sur le même écran, ajoutez les **variables d'environnement** (bouton *Add
variable*). Reprenez-les de `.env.example` ; les principales :

| Variable              | Valeur                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| `APP_URL`             | `https://disneyparistransfers.com`                                           |
| `SESSION_SECRET`      | 32 caractères aléatoires ou plus                                             |
| `ADMIN_EMAIL`         | votre identifiant                                                            |
| `ADMIN_PASSWORD_HASH` | la ligne produite par `npm run admin:hash` (commence par `scrypt:`)          |
| `DATABASE_PATH`       | `/home/VOTRE-UTILISATEUR-CPANEL/disneyparistransfers-data/app.db` — **en dehors** du dépôt, pour qu'une mise à jour ne touche jamais vos réservations |
| `SMTP_HOST` … `MAIL_TO` | votre boîte mail (réglable aussi plus tard dans Gestion → Settings)         |
| `SITE_PHONE`, `SITE_PHONE_DISPLAY`, `SITE_WHATSAPP`, `SITE_EMAIL` | vos coordonnées publiques |

Cliquez *Create*, puis **Run NPM Install**, puis **Start App** (ou *Restart*).

Ouvrez `https://disneyparistransfers.com` — le site est en ligne. Connectez-vous sur `/admin`.

> ℹ️ À la place du panneau, vous pouvez aussi déposer un fichier `.env` à la racine de
> l'application : `server.mjs` le lit au démarrage. Les variables du panneau priment sur le
> fichier.

## 4. Mettre le site à jour ensuite

1. Fusionnez la modification dans `main` sur GitHub → l'action recompile la branche
   `deploy` (environ deux minutes).
2. cPanel → **Git™ Version Control** → *Manage* → *Pull or Deploy* → **Update from Remote**,
   puis **Deploy HEAD Commit**.

L'étape de déploiement exécute `deploy.sh` : il installe les éventuels nouveaux composants
et redémarre l'application. Votre base de données n'est pas touchée (elle vit en dehors du
dépôt).

Vous préférez que ce soit automatique ? Dans cPanel → **Cron Jobs**, ajoutez par exemple
toutes les 15 minutes :

```
cd ~/disneyparistransfers && git fetch -q origin deploy && [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/deploy)" ] && git reset -q --hard origin/deploy && bash deploy.sh
```

## 5. Sauvegardes

Tout tient dans un seul fichier : le `DATABASE_PATH` ci-dessus. Sauvegardez-le avec l'outil
*Backup* de cPanel ou une tâche cron, par exemple :

```
0 3 * * * cp ~/disneyparistransfers-data/app.db ~/backups/app-$(date +\%F).db
```

## Dépannage

| Symptôme                                              | Cause et solution                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| La version 22 de Node.js n'est pas dans la liste      | Demandez à l'hébergeur de l'activer. Le site ne fonctionne pas avec les versions plus anciennes.       |
| *Run NPM Install* échoue sur `better-sqlite3`         | L'hébergeur bloque le téléchargement du module précompilé ou n'a pas d'outils de compilation. Demandez au support de l'autoriser, ou lancez `npm ci --omit=dev` depuis le Terminal pour voir l'erreur. |
| « Incomplete response / 503 » à l'ouverture du site   | Ouvrez le journal de l'application (Setup Node.js App → l'application → *stderr.log*). En général un `SESSION_SECRET` manquant ou un dossier `DATABASE_PATH` sans droits d'écriture. |
| Le site affiche l'ancienne version après un déploiement | Cliquez *Restart* dans Setup Node.js App, ou lancez `touch ~/disneyparistransfers/tmp/restart.txt`.  |
| Les e-mails ne partent pas                            | Renseignez les variables SMTP (panneau ou Gestion → Settings). En attendant, les e-mails sont écrits dans `stderr.log`. |
