# Guide d'installation — Disney Paris Transfers

> 🇬🇧 English version: [`INSTALLATION-GUIDE.md`](./INSTALLATION-GUIDE.md)

Site de chauffeur privé VTC, 7 langues, calculateur de prix, formulaire de devis,
espace de gestion et paiement en ligne facultatif.

Ce guide part du principe que vous n'êtes pas développeur. Chaque commande est à
recopier telle quelle. Comptez **30 minutes** pour une mise en ligne complète.

---

## Sommaire

1. [Ce que vous avez reçu](#1-ce-que-vous-avez-reçu)
2. [Ce qu'il vous faut](#2-ce-quil-vous-faut)
3. [Essai sur votre ordinateur (10 min)](#3-essai-sur-votre-ordinateur-10-min)
4. [Mise en ligne sur un serveur (30 min)](#4-mise-en-ligne-sur-un-serveur-30-min)
5. [Brancher les emails](#5-brancher-les-emails)
6. [Activer le paiement en ligne (facultatif)](#6-activer-le-paiement-en-ligne-facultatif)
7. [Utiliser l'espace de gestion](#7-utiliser-lespace-de-gestion)
8. [Sauvegardes](#8-sauvegardes)
9. [Modifier le site plus tard](#9-modifier-le-site-plus-tard)
10. [Dépannage](#10-dépannage)
11. [Ce qu'il reste à faire avant l'ouverture](#11-ce-quil-reste-à-faire-avant-louverture)

---

## 1. Ce que vous avez reçu

```
disney-paris-transfers/
├── .env                          ← VOS RÉGLAGES ET SECRETS (déjà pré-remplis)
├── CREDENTIALS.txt              ← mot de passe de l'espace de gestion — à supprimer
├── delivery/
│   ├── GUIDE-INSTALLATION.md     ← ce document
│   ├── INSTALLATION-GUIDE.md     ← version anglaise
│   └── schema.sql                ← structure de la base de données (documentation)
├── CLAUDE.md   CLAUDE.fr.md      ← documentation technique (pour un développeur)
├── src/                          ← le code du site
│   ├── app/                      ← les pages et l'espace de gestion
│   ├── components/               ← les éléments visuels réutilisables
│   └── lib/                      ← tarifs, traductions, base, emails, paiement
├── project/                      ← les maquettes d'origine (référence visuelle)
├── package.json                  ← liste des composants à installer
└── scripts/hash-password.mjs     ← outil de changement de mot de passe
```

Deux fichiers demandent votre attention immédiate :

| Fichier            | Rôle                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| `.env`             | Tous vos réglages. **Trois choses restent à compléter** : les emails. |
| `CREDENTIALS.txt` | Votre mot de passe de gestion. **À supprimer après le premier accès.** |

> ⚠️ Le fichier `.env` contient des clés secrètes. Ne le publiez jamais en ligne
> et ne l'envoyez pas par email non chiffré.

---

## 2. Ce qu'il vous faut

| Élément            | Détail                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| **Node.js 20 ou +**| Gratuit — <https://nodejs.org> (prenez la version « LTS »)                 |
| **Un hébergement** | Un serveur qui exécute Node.js **en continu** : VPS OVH, Hetzner, Scaleway, o2switch… |
| **Le nom de domaine** | `disneyparistransfers.com`, déjà à vous                                |
| **Une boîte email**| `contact@disneyparistransfers.com` chez votre hébergeur                    |
| **Stripe**         | Uniquement si vous voulez encaisser en ligne — facultatif                  |

### ⚠️ Un point important sur l'hébergement

Ce site **enregistre vos demandes de réservation dans un fichier sur le disque**.
Il lui faut donc un serveur classique avec un disque qui garde les données.

- ✅ **Convient** : VPS (OVH, Hetzner, Scaleway, DigitalOcean…), serveur dédié,
  hébergement mutualisé avec support Node.js (o2switch, Planethoster…).
- ❌ **Ne convient pas** : Vercel, Netlify, Cloudflare Pages. Ces plateformes
  effacent le disque à chaque redémarrage : **vous perdriez toutes vos réservations.**
- ❌ **Ne convient pas** : un hébergement PHP seul (type mutualisé « site WordPress »).
  Ce site n'est pas en PHP.

Un VPS d'entrée de gamme (~5 €/mois) est largement suffisant.

---

## 3. Essai sur votre ordinateur (10 min)

Avant la mise en ligne, faites tourner le site chez vous pour le découvrir.

**1.** Installez Node.js depuis <https://nodejs.org> (version LTS).

**2.** Ouvrez un terminal (Windows : *PowerShell* ; Mac : *Terminal*) et placez-vous
dans le dossier du site :

```bash
cd chemin/vers/disney-paris-transfers
```

**3.** Vérifiez que Node est bien installé — la commande doit afficher `v20…` ou plus :

```bash
node -v
```

**4.** Installez les composants du site (quelques minutes, une seule fois) :

```bash
npm install
```

**5.** Pour l'essai en local, ouvrez le fichier `.env` avec un éditeur de texte et
remplacez temporairement la première ligne par :

```
APP_URL=http://localhost:3000
```

**6.** Lancez le site :

```bash
npm run dev
```

**7.** Ouvrez votre navigateur sur <http://localhost:3000>.

Le site est là, en français. Essayez :

- le **calculateur de prix** en haut de l'accueil (changez les passagers : les
  véhicules trop petits se grisent tout seuls) ;
- le **sélecteur de langue** en haut à droite — les 7 langues sont rédigées ;
- le **formulaire de réservation** : envoyez une demande de test ;
- l'**espace de gestion** sur <http://localhost:3000/admin>, avec les identifiants
  du fichier `CREDENTIALS.txt`. Votre demande de test doit s'y trouver.

Pour arrêter le site : `Ctrl + C` dans le terminal.

> 💡 Tant que les emails ne sont pas configurés (étape 5), aucun message n'est
> envoyé — mais **les demandes sont bien enregistrées** et visibles dans la gestion.
> Vous verrez leur contenu s'afficher dans le terminal.

---

## 4. Mise en ligne sur un serveur (30 min)

Exemple sur un VPS Ubuntu. Adaptez les chemins si votre hébergeur diffère.

### 4.1 Préparer le serveur

Connectez-vous en SSH, puis :

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Outils de compilation (pour la base de données) et serveur web
sudo apt-get install -y build-essential nginx

# Gestionnaire qui garde le site allumé et le relance après un redémarrage
sudo npm install -g pm2
```

### 4.2 Envoyer le site

Depuis **votre ordinateur**, envoyez le dossier (sans les fichiers temporaires) :

```bash
rsync -av --exclude node_modules --exclude .next --exclude .git \
  ./disney-paris-transfers/ root@VOTRE-IP:/var/www/disneyparistransfers/
```

*(Sans `rsync`, un simple envoi par FTP/SFTP du dossier convient aussi — en
excluant `node_modules` et `.next` s'ils existent.)*

### 4.3 Installer et compiler

Sur le serveur :

```bash
cd /var/www/disneyparistransfers

# Le fichier .env contient vos secrets : lui seul peut le lire
chmod 600 .env

npm ci            # installe les composants
npm run build     # compile le site (1 à 2 minutes)
```

La compilation doit se terminer par `✓ Generating static pages (113/113)`.

### 4.4 Démarrer et rendre permanent

```bash
pm2 start npm --name disneyparistransfers -- start
pm2 save
pm2 startup       # exécutez la ligne que cette commande vous affiche
```

Le site tourne maintenant sur le port 3000 et redémarre tout seul après une
coupure de courant.

Commandes utiles :

```bash
pm2 status                        # le site tourne-t-il ?
pm2 logs disneyparistransfers     # voir ce qui se passe (Ctrl+C pour sortir)
pm2 restart disneyparistransfers  # redémarrer
```

### 4.5 Brancher le nom de domaine

Chez votre registrar, faites pointer `disneyparistransfers.com` et
`www.disneyparistransfers.com` vers l'adresse IP du serveur (enregistrements `A`).

Puis créez le fichier `/etc/nginx/sites-available/disneyparistransfers` :

```nginx
server {
    listen 80;
    server_name disneyparistransfers.com www.disneyparistransfers.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Les notifications de paiement Stripe doivent arriver telles quelles
    location /api/webhooks/stripe {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_request_buffering off;
    }
}
```

Activez-le :

```bash
sudo ln -s /etc/nginx/sites-available/disneyparistransfers /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4.6 Activer le HTTPS (cadenas)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d disneyparistransfers.com -d www.disneyparistransfers.com
```

Le certificat se renouvelle ensuite tout seul.

Ouvrez <https://disneyparistransfers.com> : le site est en ligne. 🎉

> ℹ️ La base de données se crée toute seule au premier chargement, dans
> `data/app.db`, avec la grille tarifaire de départ. Vous n'avez aucun fichier SQL
> à exécuter. `delivery/schema.sql` est fourni à titre de documentation, et pour
> reconstruire une base vide en cas de besoin.

---

## 5. Brancher les emails

Sans cette étape, **le site fonctionne et enregistre tout**, mais vous ne recevez
pas d'alerte par email et le client n'a pas d'accusé de réception.

Ouvrez `.env` et complétez la section 4 avec les réglages de votre boîte email :

```
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@disneyparistransfers.com
SMTP_PASS=le-mot-de-passe-de-votre-boite-email
```

Réglages selon l'hébergeur :

| Hébergeur | `SMTP_HOST`             | Port |
| --------- | ----------------------- | ---- |
| OVH       | `ssl0.ovh.net`          | 465  |
| Gandi     | `mail.gandi.net`        | 465  |
| Ionos     | `smtp.ionos.fr`         | 465  |
| o2switch  | `mail.votredomaine.com` | 465  |
| Gmail     | `smtp.gmail.com`        | 465  |

*(Gmail exige un « mot de passe d'application », pas votre mot de passe habituel.)*

Puis redémarrez :

```bash
pm2 restart disneyparistransfers
```

Envoyez une demande de test depuis le site. Vous devez recevoir :

- **vous** : un email « Nouvelle demande DPT-XXXXXX », en français, avec tout le
  détail du trajet. Répondre à cet email écrit directement au client ;
- **le client** : un accusé de réception **dans sa langue**, avec sa référence.

> 💡 Si vos emails arrivent en indésirables, ajoutez un enregistrement **SPF** à
> votre domaine (votre hébergeur email vous donne la ligne exacte à copier).

---

## 6. Activer le paiement en ligne (facultatif)

Par défaut le paiement en ligne est **désactivé** : vos clients règlent à bord,
comme prévu dans les maquettes. Aucun bouton de paiement n'apparaît nulle part.

Pour l'activer :

**1.** Créez un compte sur <https://dashboard.stripe.com>.

**2.** *Développeurs → Clés API* : copiez la **clé secrète** (`sk_live_…`) dans le
`.env` :

```
STRIPE_SECRET_KEY=sk_live_...
```

**3.** *Développeurs → Webhooks → Ajouter un point de terminaison* :

- URL : `https://disneyparistransfers.com/api/webhooks/stripe`
- Événements : `checkout.session.completed` et `checkout.session.expired`

Copiez la **signature secrète** (`whsec_…`) dans le `.env` :

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

**4.** Redémarrez (`pm2 restart disneyparistransfers`), puis allez dans
**Gestion → Settings** : la case « Activer le paiement en ligne » est maintenant
cliquable. Vous y choisissez :

- **paiement intégral** du transfert, ou
- **acompte** (30 % par défaut, réglable), le solde étant réglé à bord.

Vous pouvez décocher cette case à tout moment : le paiement en ligne disparaît
aussitôt du site, sans rien casser.

> 🔒 Le montant débité est **toujours recalculé par le serveur** à partir de votre
> grille tarifaire. Un client qui bidouillerait la page dans son navigateur ne peut
> pas changer le prix qu'il paie.

---

## 7. Utiliser l'espace de gestion

Adresse : **`https://disneyparistransfers.com/admin`**

L'espace de gestion est **en anglais**. Les noms des pages sont indiqués
ci-dessous entre parenthèses.

### Première connexion

Connectez-vous avec les identifiants de `CREDENTIALS.txt`, puis **changez
immédiatement le mot de passe** :

```bash
cd /var/www/disneyparistransfers
npm run admin:hash -- 'votre-nouveau-mot-de-passe'
```

Recopiez la ligne `ADMIN_PASSWORD_HASH=…` affichée dans votre `.env` (en
remplaçant l'ancienne), redémarrez, puis **supprimez `CREDENTIALS.txt`**.

> ⚠️ Collez la ligne **telle quelle**, sans guillemets autour.

### Les quatre pages

**Bookings** (demandes) — toutes les demandes reçues, de la plus récente à la
plus ancienne. Filtrez par statut, cliquez sur une référence pour voir le
détail. Sur la fiche vous pouvez :

- changer le statut : *New → Quoted → Confirmed* (ou *Cancelled*) ;
- corriger le prix (laissez vide pour « sur devis ») ;
- écrire des notes internes, jamais visibles par le client ;
- répondre en un clic par **WhatsApp**, téléphone ou email.

Chaque demande affiche aussi **le détail du calcul du prix** — course ou
forfait, supplément de nuit, chaque option — pour que vous voyiez d'un coup
d'œil pourquoi tel montant a été annoncé.

**Rates** (tarifs) — votre grille, modifiable sans toucher au code. Chaque ligne
contient six prix, séparés par des espaces, correspondant aux paliers de
passagers **1-3, 4, 5, 6, 7, 8**. Exemple :

```
CDG Airport ↔ Disneyland Paris      70 80 85 90 90 105
```

L'aller-retour est calculé automatiquement (× 2), et le prix par véhicule aussi
(SUV + 10 %, Premium + 50 %). Vider une ligne retire la liaison de la grille :
elle passera « sur devis ». Vous pouvez aussi ajouter une nouvelle liaison en bas
de page.

**Saisissez ici des prix de jour.** Si vous utilisez le supplément de nuit (voir
*Settings*), il s'ajoute par-dessus ces montants — ne l'intégrez pas vous-même
à la grille.

**Packages & add-ons** (forfaits et options) — la partie de l'offre que vous
créez vous-même.

Un **forfait** (*package*) se vend à son propre prix fixe et ignore complètement
la grille tarifaire : *« CDG ⇄ Disneyland aller-retour, jusqu'à 6 passagers,
150 € »*. Donnez-lui un nom, un prix, une description et le nombre maximum de
passagers. Le client en choisit un en haut du formulaire de réservation, à la
place d'un trajet. Cochez *Night supplement applies* si le forfait doit être
majoré la nuit, décochez si le prix est le prix quelle que soit l'heure.

Une **option** (*add-on*) se facture en plus du prix obtenu : siège enfant,
heure d'attente, accueil avec pancarte. Indiquez un prix, puis :

- *Charge per unit* — 12 € l'unité, donc deux sièges enfant font 24 €.
  Laissez décoché pour un forfait unique quelle que soit la quantité.
- *Max quantity* — 1 affiche l'option sous forme de case à cocher sur le
  formulaire, davantage affiche une liste déroulante.

Les options ne sont **jamais majorées la nuit** : un siège enfant coûte le même
prix à 3 h du matin qu'à 15 h.

> ⚠️ Les noms des forfaits et des options sont affichés aux visiteurs
> **exactement tels que vous les saisissez**, dans les 7 langues — ils ne
> passent pas par les traductions du site. Rédigez-les dans la langue que lisent
> la plupart de vos clients.

Décochez *Visible on the site* / *Offered at booking* pour retirer un forfait ou
une option sans le supprimer. Supprimer un forfait ne modifie **aucune**
réservation déjà prise : le nom et le prix sont figés sur la demande au moment
où le client l'envoie.

**Settings** (réglages) — les horaires de nuit, l'interrupteur du paiement en
ligne, et un rappel de vos coordonnées publiques (elles se modifient dans le
`.env`).

Pour mettre en place le **supplément de nuit** :

1. cochez *Night supplement* ;
2. renseignez *Night starts at* et *Night ends at* — par exemple `22:00` et
   `06:00`. Une heure de fin antérieure à l'heure de début signifie simplement
   que la plage passe minuit, ce qui est le cas normal ;
3. indiquez le pourcentage — par exemple `20` pour + 20 %.

L'encadré juste en dessous vous redit en toutes lettres ce que vous venez de
régler, et ce que deviendrait un transfert à 80 €. Le supplément s'applique
ensuite à toute course, tout trajet et tout forfait éligible dont **l'heure de
prise en charge** tombe dans la plage. Sur un aller-retour il s'applique aux
deux trajets, d'après l'heure de prise en charge de l'aller.

Une demande sans heure de prise en charge n'est jamais majorée — il n'y a rien
sur quoi se fonder. C'est volontaire : traitez celles-là à la main.

Toutes les modifications, sur les quatre pages, sont **visibles immédiatement**
sur le site, dans les 7 langues.

---

## 8. Sauvegardes

Toutes vos réservations tiennent dans **un seul fichier** : `data/app.db`.
Sauvegardez-le régulièrement.

Sauvegarde manuelle :

```bash
cp /var/www/disneyparistransfers/data/app.db ~/sauvegarde-$(date +%F).db
```

Sauvegarde automatique chaque nuit à 3 h — tapez `crontab -e` puis ajoutez :

```
0 3 * * * cp /var/www/disneyparistransfers/data/app.db /root/sauvegardes/app-$(date +\%F).db
```

*(Créez d'abord le dossier : `mkdir -p /root/sauvegardes`.)*

Pensez aussi à garder une copie de votre fichier `.env` en lieu sûr : sans lui,
vos réglages et votre accès à la gestion sont perdus.

---

## 9. Modifier le site plus tard

| Ce que vous voulez changer          | Où                                            | Redémarrage ? |
| ----------------------------------- | --------------------------------------------- | ------------- |
| Les prix                            | Gestion → **Rates**                           | non           |
| Horaires de nuit et supplément      | Gestion → **Settings**                        | non           |
| Forfaits et options payantes        | Gestion → **Packages & add-ons**              | non           |
| Activer / couper le paiement en ligne | Gestion → **Settings**                      | non           |
| Numéro de téléphone, WhatsApp, email | `.env` section 6                             | **oui**       |
| Textes, photos, nouvelles pages      | fichiers `src/` — travail de développeur      | **oui** + recompilation |

Après toute modification de `.env` :

```bash
pm2 restart disneyparistransfers
```

Après une modification du code (`src/`) :

```bash
npm run build && pm2 restart disneyparistransfers
```

Les **photos** attendues (véhicule, accueil pancarte, portrait) apparaissent
aujourd'hui comme des rectangles hachurés portant leur description. De même, les
trois **avis clients** de l'accueil sont des emplacements réservés. Les remplacer
demande une courte intervention d'un développeur — le fichier `CLAUDE.md` lui
indique exactement où.

---

## 10. Dépannage

**Le site ne démarre pas / `pm2 status` affiche `errored`**

```bash
pm2 logs disneyparistransfers --lines 50
```

Les causes les plus fréquentes :

| Message                                   | Cause et remède                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `SESSION_SECRET manquant ou trop court`   | Le `.env` n'est pas à la racine du projet, ou la ligne a été effacée.   |
| `EADDRINUSE ... 3000`                     | Un autre programme occupe le port. Changez `PORT=3001` dans le `.env`.  |
| `Cannot find module`                      | `npm ci` n'a pas été lancé, ou a échoué. Relancez-le.                   |
| Erreur pendant `npm ci` sur `better-sqlite3` | Outils de compilation manquants : `sudo apt-get install -y build-essential python3`. |

**Je n'arrive pas à me connecter à la gestion**

Vérifiez que la ligne `ADMIN_PASSWORD_HASH` de votre `.env` :

- commence bien par `scrypt:` ;
- est **sur une seule ligne**, sans guillemets, sans espace ;
- a été recopiée entièrement (elle est longue).

Le compteur de tentatives bloque après 8 essais ratés : attendez 15 minutes.
En dernier recours, régénérez un mot de passe avec `npm run admin:hash`.

**Je ne reçois pas les emails**

1. `pm2 logs disneyparistransfers` — si vous lisez `[mail] SMTP non configuré`,
   c'est que `SMTP_HOST` est resté vide dans le `.env`.
2. Vérifiez le mot de passe de la boîte email, et que le port 465 n'est pas bloqué.
3. Regardez vos indésirables, et ajoutez un enregistrement SPF au domaine.

**Les demandes sont-elles perdues si les emails échouent ?**
Non. L'enregistrement en base a lieu **avant** l'envoi : tout est toujours
consultable dans Gestion → Bookings.

**Une page affiche « 404 »**
Vérifiez l'adresse : chaque page existe sous sa forme traduite.
`/fr/tarifs` et `/es/precios` fonctionnent, `/fr/prices` non — c'est volontaire,
pour éviter que Google voie plusieurs adresses pour un même contenu.

---

## 11. Ce qu'il reste à faire avant l'ouverture

Par ordre d'importance :

1. **Vérifier les prix.** Seules les liaisons au départ de **CDG** reprennent des
   tarifs relevés sur le marché. Toutes les autres (Orly, Beauvais, Paris,
   Versailles…) ont été **estimées** et doivent être confirmées.
   → Gestion → Rates.

2. **Faire relire les traductions.** Les 7 langues sont entièrement rédigées, mais
   les versions **russe, chinoise et japonaise** n'ont pas été relues par un
   locuteur natif. Une relecture est recommandée avant de communiquer dessus.

3. **Fournir vos photos** : intérieur du véhicule avec sièges enfants, accueil
   pancarte à l'aéroport, portrait du chauffeur, berline, van, Mercedes.

4. **Coller vos avis** Google / TripAdvisor à la place des trois emplacements
   réservés sur l'accueil.

5. **Personnaliser la page « À propos »** : le texte contient un encadré vous
   invitant à vous présenter (prénom, années d'expérience, langues parlées).

6. **Mentions légales et CGV.** Une activité VTC en France doit afficher ses
   mentions légales (numéro SIREN, inscription au registre VTC, assurance,
   médiateur de la consommation). Cette page n'existe pas encore : faites-la
   ajouter avant l'ouverture commerciale.

7. **Déclarer le site** à la Google Search Console et y soumettre le plan du site :
   `https://disneyparistransfers.com/sitemap.xml` (105 adresses, 7 langues).

---

## Récapitulatif des commandes

```bash
npm install       # installer les composants (une seule fois)
npm run dev       # lancer en mode essai sur votre ordinateur
npm run build     # compiler pour la mise en ligne
npm start         # démarrer la version en ligne
npm run admin:hash -- 'mot-de-passe'   # changer le mot de passe de gestion

pm2 status                        # le site tourne-t-il ?
pm2 logs disneyparistransfers     # consulter les journaux
pm2 restart disneyparistransfers  # redémarrer après modification du .env
```

---

*Documentation technique destinée à un développeur : voir `CLAUDE.md` à la racine
du projet.*
