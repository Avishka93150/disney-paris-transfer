# Mise en ligne sur le serveur Plesk — `deploy.sh`

> 🇬🇧 English version: [`DEPLOY-PLESK.md`](./DEPLOY-PLESK.md)
>
> Pour le serveur **151.80.21.79** administré avec Plesk, qui sert `disneyparistransfers.com`.
> Pour un serveur sans Plesk, voir [`GUIDE-INSTALLATION.md`](./GUIDE-INSTALLATION.md).

Un seul script fait tout, première mise en ligne comme mises à jour : `deploy.sh`, à la
racine du projet. Vous le lancez depuis le terminal intégré à Plesk.

## Avant la première mise en ligne — une chose à vérifier

Le site a besoin de **Node.js 22 (ou plus récent)**. Dans Plesk : *Outils & Paramètres →
Mises à jour → Ajouter/Supprimer des composants → Hébergement web → Support Node.js* :
cochez **Node.js 22**. Le script s'arrête avec un message clair s'il manque.

## Première mise en ligne (5 minutes)

1. Dans Plesk, ouvrez **Outils & Paramètres → Terminal SSH** (vous y êtes `root`). Si
   l'icône *Terminal SSH* manque, installez l'extension gratuite de ce nom depuis
   *Extensions*, ou connectez-vous avec n'importe quel client SSH en `root@151.80.21.79`.
2. Collez cette ligne et validez :

   ```bash
   curl -fsSL https://raw.githubusercontent.com/Avishka93150/disney-paris-transfer/main/deploy.sh | bash
   ```

3. Le script pose deux questions — l'**e-mail** et le **mot de passe** de l'espace de
   gestion (laissez le mot de passe vide et il en génère un, affiché à la fin). Tout le
   reste est automatique :

   - le code est téléchargé depuis GitHub dans
     `/var/www/vhosts/disneyparistransfers.com/httpdocs`. Ce qui s'y trouvait est déplacé
     dans `httpdocs.before-<date>`, et s'il s'agissait de la version précédente de ce site,
     sa **base de réservations et son `.env` sont repris** ;
   - un `.env` est créé (clé secrète, identifiants admin, base de données dans
     `/var/www/vhosts/disneyparistransfers.com/data/app.db` — hors du dossier du code, pour
     qu'une mise à jour ne puisse jamais y toucher) ;
   - le site est installé et compilé ;
   - l'application Node.js est configurée dans Plesk et démarrée.

4. Lisez les dernières lignes : le script affiche le mot de passe admin s'il l'a généré, et
   dit si `https://disneyparistransfers.com/en` répond. Si ce n'est pas encore le cas,
   vérifiez les réglages de la section suivante et cliquez *Redémarrer l'application*.

> 🔒 L'ancien site n'est pas supprimé, seulement déplacé. Supprimez vous-même
> `httpdocs.before-<date>` une fois le nouveau site validé.

## L'application Node.js dans Plesk

Le script règle tout cela lui-même quand il tourne en `root`. S'il n'a pas pu (il le dit),
réglez-les dans *Sites web & Domaines → disneyparistransfers.com → Node.js* :

| Champ                          | Valeur                                     |
| ------------------------------ | ------------------------------------------ |
| Version de Node.js             | **22** (ou plus récent)                    |
| Mode de l'application          | production                                 |
| Racine de l'application        | `/httpdocs`                                |
| Racine du document             | `/httpdocs/dist/client`                    |
| Fichier de démarrage           | `server.mjs`                               |

Aucune variable d'environnement n'est nécessaire dans le panneau : le site lit
`httpdocs/.env`. Puis *Activer Node.js* (la première fois) ou *Redémarrer l'application*.

**HTTPS :** *Sites web & Domaines → Certificats SSL/TLS → Let's Encrypt*, pour le domaine
et `www`, et cochez *Rediriger HTTP vers HTTPS* dans *Paramètres d'hébergement*.
(Probablement déjà en place si le domaine était en ligne avant.)

## Chaque mise à jour ensuite — une commande

Ouvrez le terminal Plesk et lancez :

```bash
bash /var/www/vhosts/disneyparistransfers.com/httpdocs/deploy.sh
```

Il récupère le dernier code depuis GitHub (`main`), recompile, redémarre. Environ une
minute. Votre `.env` et vos réservations ne sont pas touchés.

Pour mettre en ligne une branche précise (une pull request à essayer avant de la
fusionner) :

```bash
BRANCH=nom-de-la-branche bash /var/www/vhosts/disneyparistransfers.com/httpdocs/deploy.sh
```

## Réglages

- **Boîte mail, Stripe, numéro de téléphone :** modifiez `httpdocs/.env` (voir
  `.env.example`), puis *Redémarrer l'application* — ou, pour SMTP et Stripe, passez par
  *Gestion → Settings*, qui ne demande aucun redémarrage.
- **Tarifs, heures de nuit, forfaits, options :** l'espace de gestion, effet immédiat.

## Sauvegardes

Tout tient dans un seul fichier : `/var/www/vhosts/disneyparistransfers.com/data/app.db`.
Incluez le dossier `data` dans la planification du *Gestionnaire de sauvegardes* de Plesk,
ou ajoutez une *Tâche planifiée* :

```
cp /var/www/vhosts/disneyparistransfers.com/data/app.db /var/www/vhosts/disneyparistransfers.com/backups/app-$(date +\%F).db
```

## Dépannage

| Symptôme                                                 | Cause et solution                                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| « Node.js not found » / « too old »                      | Installez le composant *Node.js 22* (*Outils & Paramètres → Mises à jour*), relancez le script.        |
| `npm ci` échoue sur `better-sqlite3`                     | Le serveur n'a pas d'outils de compilation ou bloque le téléchargement du module. `apt install build-essential python3` (Ubuntu/Debian) ou `dnf groupinstall "Development Tools"` (AlmaLinux), puis relancez le script. |
| « Web application could not be started » / 503          | *Node.js → Journaux* (`stderr`). En général les réglages Node.js ci-dessus (fichier de démarrage, racine de l'application) ou une racine du document erronée. |
| Le site affiche l'ancienne version                       | Cliquez *Redémarrer l'application*, ou `touch /var/www/vhosts/disneyparistransfers.com/httpdocs/tmp/restart.txt`. |
| Les photos ou les polices répondent 404                  | La *racine du document* doit être `/httpdocs/dist/client`.                                             |
| Les e-mails ne partent pas                               | Renseignez le SMTP (`.env` ou Gestion → Settings). En attendant, les e-mails sont écrits dans le journal de l'application. |
| Mot de passe admin perdu                                 | Sur le serveur : `cd /var/www/vhosts/disneyparistransfers.com/httpdocs && npm run admin:hash -- 'nouveau-mot-de-passe'`, collez la ligne `ADMIN_PASSWORD_HASH=` affichée dans `.env`, *Redémarrer l'application*. |
