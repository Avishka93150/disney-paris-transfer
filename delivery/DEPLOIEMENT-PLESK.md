# Mise en ligne sur Plesk (application Node.js)

> 🇬🇧 English version: [`DEPLOY-PLESK.md`](./DEPLOY-PLESK.md)
>
> Ce guide concerne un serveur administré avec **Plesk** et son support Node.js. Pour un VPS
> nu, sans Plesk, suivez plutôt [`GUIDE-INSTALLATION.md`](./GUIDE-INSTALLATION.md).

## Le principe

Le site est **compilé par GitHub, pas par votre serveur**. À chaque fois que du code arrive
sur la branche `main`, une action GitHub compile le site et publie le résultat sur une
branche nommée `deploy`. Plesk récupère cette branche, installe les composants nécessaires
et redémarre l'application. Votre serveur ne lance jamais la compilation.

```
GitHub main ──(Action : compilation)──▶ GitHub deploy ──(Git Plesk : pull)──▶ votre serveur
```

## Avant de commencer — deux choses à vérifier

1. **Node.js 22 (ou plus récent) est installé dans Plesk.** *Outils & Paramètres → Mises à
   jour → Ajouter/Supprimer des composants → Hébergement web → Support Node.js* : cochez
   **Node.js 22** (et les versions suivantes si elles sont proposées). Le site ne peut pas
   fonctionner avec Node 20 ou 18.
2. L'extension **Git** est présente (*Sites web & Domaines → votre domaine → Git*). Elle fait
   partie de Plesk Obsidian ; si l'icône manque, installez-la depuis *Extensions*.

## 1. Publier la branche `deploy` (une seule fois)

1. Fusionnez le site dans `main` sur GitHub (ou ouvrez l'onglet **Actions**, choisissez
   *Build deploy branch*, cliquez *Run workflow* et choisissez la branche à publier).
2. Attendez la coche verte. Une branche `deploy` existe maintenant dans le dépôt.

## 2. La récupérer avec Git dans Plesk

*Sites web & Domaines → disneyparistransfers.com → Git → Ajouter un dépôt* :

| Champ                                   | Valeur                                                              |
| --------------------------------------- | ------------------------------------------------------------------- |
| Dépôt                                   | Hébergement Git distant tel que GitHub                              |
| Dépôt Git distant                       | `https://github.com/Avishka93150/disney-paris-transfer.git`         |
| Branche                                 | **`deploy`**                                                        |
| Déployer vers                           | `/httpdocs` (la valeur par défaut)                                  |
| Mode de déploiement                     | *Automatique* (voir l'étape 5) — ou *Manuel* si vous préférez cliquer |
| Actions de déploiement supplémentaires  | `bash /var/www/vhosts/disneyparistransfers.com/httpdocs/deploy.sh`  |

> Si le dépôt GitHub est privé, Plesk affiche une clé publique SSH quand vous choisissez
> l'URL SSH (`git@github.com:Avishka93150/disney-paris-transfer.git`) : ajoutez-la sur GitHub
> comme *deploy key* du dépôt.
>
> L'action de déploiement a besoin que l'utilisateur système du domaine dispose d'un vrai
> shell : *Sites web & Domaines → Hébergement & DNS → Accès à l'hébergement web → Accès au
> serveur via SSH* : **`/bin/bash`** (ni *chrooté*, ni *interdit*). Sinon, laissez l'action
> vide et utilisez les boutons *NPM install* et *Redémarrer l'application* de l'étape 3
> après chaque déploiement.

Cliquez *OK* : Plesk clone la branche dans `httpdocs`.

## 3. Activer Node.js sur le domaine

*Sites web & Domaines → disneyparistransfers.com → Node.js → Activer Node.js*, puis
réglez :

| Champ                            | Valeur                                              |
| -------------------------------- | --------------------------------------------------- |
| Version de Node.js               | **22** (ou plus récent)                             |
| Gestionnaire de paquets          | npm                                                 |
| Racine du document               | `/httpdocs/dist/client` — photos, polices et scripts sont alors servis directement par le serveur web |
| Mode de l'application            | production                                          |
| Racine de l'application          | `/httpdocs`                                         |
| Fichier de démarrage             | `server.mjs`                                        |

Puis **Variables d'environnement personnalisées → Spécifier** et ajoutez-les (reprenez
`.env.example`) ; les principales :

| Variable              | Valeur                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| `APP_URL`             | `https://disneyparistransfers.com`                                           |
| `SESSION_SECRET`      | 32 caractères aléatoires ou plus                                             |
| `ADMIN_EMAIL`         | votre identifiant                                                            |
| `ADMIN_PASSWORD_HASH` | la ligne produite par `npm run admin:hash` (commence par `scrypt:`)          |
| `DATABASE_PATH`       | `/var/www/vhosts/disneyparistransfers.com/data/app.db` — **en dehors** de `httpdocs`, pour qu'une mise à jour ne touche jamais vos réservations |
| `SMTP_HOST` … `MAIL_TO` | votre boîte mail (réglable aussi plus tard dans Gestion → Settings)         |
| `SITE_PHONE`, `SITE_PHONE_DISPLAY`, `SITE_WHATSAPP`, `SITE_EMAIL` | vos coordonnées publiques |

Cliquez *Appliquer*, puis **NPM install** (seulement la première fois, ou si l'action de
déploiement n'a pas pu s'exécuter), puis **Redémarrer l'application**.

Ouvrez `https://disneyparistransfers.com` — le site est en ligne. Connectez-vous sur `/admin`.

> ℹ️ À la place du panneau, vous pouvez aussi déposer un fichier `.env` dans `httpdocs` :
> `server.mjs` le lit au démarrage. Les variables définies dans Plesk priment sur le fichier.

## 4. HTTPS

*Sites web & Domaines → Certificats SSL/TLS → Let's Encrypt* : émettez un certificat pour
le domaine et `www`, et cochez *Rediriger HTTP vers HTTPS* dans *Paramètres d'hébergement*.

## 5. Mettre le site à jour ensuite

1. Fusionnez la modification dans `main` sur GitHub → l'action recompile la branche
   `deploy` (environ deux minutes).
2. **Mode automatique :** Plesk affiche une *URL de webhook* sur la page du dépôt. Sur
   GitHub, ouvrez *Settings → Webhooks → Add webhook*, collez cette URL, type de contenu
   `application/json`, événement *Just the push event*. Dès lors chaque nouvelle compilation
   se déploie toute seule : Plesk récupère `deploy` et lance `deploy.sh`, qui installe les
   éventuels nouveaux composants et redémarre l'application.
3. **Mode manuel :** *Sites web & Domaines → Git → Récupérer les mises à jour* (puis
   *NPM install* et *Redémarrer l'application* si l'action de déploiement n'est pas en
   place).

Votre base de données n'est pas touchée dans les deux cas — elle vit en dehors de
`httpdocs`.

## 6. Sauvegardes

Tout tient dans un seul fichier : le `DATABASE_PATH` ci-dessus. Incluez `/data` dans la
planification du *Gestionnaire de sauvegardes* de Plesk, ou ajoutez une *Tâche planifiée* :

```
cp /var/www/vhosts/disneyparistransfers.com/data/app.db /var/www/vhosts/disneyparistransfers.com/backups/app-$(date +\%F).db
```

## Dépannage

| Symptôme                                                 | Cause et solution                                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Node.js 22 n'est pas dans la liste des versions          | Installez le composant *Node.js 22* (*Outils & Paramètres → Mises à jour*). Le site ne fonctionne pas avec les versions plus anciennes. |
| L'action de déploiement échoue avec « npm not found »    | Le shell de l'utilisateur système est *chrooté* ou *interdit* : passez-le en `/bin/bash`, ou utilisez le bouton *NPM install*. |
| *NPM install* échoue sur `better-sqlite3`                | Le serveur bloque le téléchargement du module précompilé ou n'a pas d'outils de compilation (`gcc`, `make`, `python3`). Installez-les ou autorisez le téléchargement, puis réessayez. |
| « Web application could not be started » / 503          | Ouvrez le journal : *Node.js → l'application → Journaux* (`stderr`). En général un `SESSION_SECRET` manquant ou un dossier `DATABASE_PATH` sur lequel l'utilisateur système n'a pas les droits (`chown` vers l'utilisateur du domaine). |
| Le site affiche l'ancienne version après un déploiement  | Cliquez *Redémarrer l'application*, ou lancez `touch /var/www/vhosts/disneyparistransfers.com/httpdocs/tmp/restart.txt`. |
| Les photos ou les polices répondent 404                  | La *Racine du document* doit être `/httpdocs/dist/client` (étape 3).                                   |
| Les e-mails ne partent pas                               | Renseignez les variables SMTP (panneau ou Gestion → Settings). En attendant, les e-mails sont écrits dans le journal de l'application. |
