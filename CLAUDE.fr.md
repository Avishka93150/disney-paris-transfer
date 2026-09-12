# CLAUDE.fr.md — Disney Paris Transfers

> **La version anglaise (`CLAUDE.md`) fait foi.** Ce document est sa traduction française,
> tenue à jour pour le client. Si vous modifiez l'un, modifiez l'autre.
>
> Le code est entièrement en anglais — identifiants, commentaires, interface d'administration.
> Le site public est multilingue, **l'anglais étant la langue par défaut**.

Site de chauffeur privé (VTC) pour `disneyparistransfers.com`, spécialisé dans les transferts
entre les aéroports de Paris (CDG, Orly, Beauvais), le centre de Paris et Disneyland Paris.

Ce dépôt implémente les maquettes exportées depuis Claude Design — conservées intactes dans
`project/`, avec le `README.md` et les `chats/` du bundle de transfert.
**Les maquettes font foi pour tout ce qui est visuel.** Tout écart de couleur, d'espacement
ou de typographie par rapport à `project/*.dc.html` est un bug.

---

## Stack

| Couche         | Choix                                                                              |
| -------------- | ---------------------------------------------------------------------------------- |
| Framework      | Astro 7 (rendu serveur, adaptateur Node) — **sans React, sans framework client**    |
| Templates      | Composants `.astro` rendus en HTML complet côté serveur, TypeScript strict          |
| JS client      | Quelques petits scripts TypeScript « vanilla » dans `src/scripts/` (≈ 10 Ko en tout)|
| Styles         | Tailwind CSS v4 (configuration en CSS, `src/styles/globals.css`)                    |
| Polices        | Fichiers `.woff2` auto-hébergés dans `public/fonts/` — aucun appel à Google Fonts   |
| Base de données| SQLite via `better-sqlite3` (fichier `data/app.db`)                                 |
| E-mail         | SMTP classique via `nodemailer`                                                     |
| Paiement       | Stripe Checkout — **activable/désactivable depuis l'admin**                         |
| Auth admin     | Cookie de session signé HMAC + mot de passe `scrypt` (aucune dépendance externe)    |
| Validation     | `zod` sur chaque entrée d'API                                                       |

**Pourquoi cette stack.** Chaque URL publique répond par un document HTML fini : titre, meta
description, canonical, `hreflang` pour les neuf langues, Open Graph, JSON-LD et l'intégralité
du contenu — y compris le prix par défaut du calculateur et chaque tarif des grilles — sans
rien laisser à exécuter au robot d'indexation. Pas d'hydratation, pas de runtime de
framework ; le seul JavaScript est celui dont le calculateur, le formulaire et les menus ont
besoin.

Hébergement cible : un **serveur Node classique** (OVH, Gandi, un VPS…) avec Node.js
**22.12 ou plus récent**, pas une plateforme serverless. SQLite et SMTP supposent un système
de fichiers persistant et un processus qui vit longtemps. Déployer sur Vercel/Netlify/
Cloudflare Pages perdrait silencieusement toutes les réservations à chaque redémarrage.

---

## Design tokens

Repris tels quels des maquettes. **Ne pas inventer de nouvelles couleurs.**

| Rôle                            | Hex       | Utilitaire Tailwind         |
| ------------------------------- | --------- | --------------------------- |
| Fond crème (page)               | `#FBF6ED` | `bg-cream`                  |
| Fond sable (sections)           | `#F6E9D8` | `bg-sand`                   |
| Surface / cartes                | `#FFFDF9` | `bg-surface`                |
| Bordure                         | `#EBDFC9` | `border-line`               |
| Terracotta (accent, CTA)        | `#B4552D` | `text-brand` / `bg-brand`   |
| Terracotta foncé (survol)       | `#8F3F1E` | `bg-brand-dark`             |
| Brun profond (texte, pied)      | `#3A2E24` | `text-ink` / `bg-ink`       |
| Brun moyen (texte courant)      | `#6B5641` | `text-ink-soft`             |
| Brun clair (texte tertiaire)    | `#8F7455` | `text-ink-mute`             |
| Beige sur brun                  | `#C9B79E` | `text-cream-soft`           |
| Or (CTA sur brun)               | `#D9A441` | `bg-gold`                   |
| Or foncé (survol)               | `#C4902F` | `bg-gold-dark`              |
| Vert WhatsApp (fond clair)      | `#E8F0DC` | `bg-whatsapp`               |

**Typographie** — `Bree Serif` pour tous les titres (`font-display`), `Nunito` 400/600/700/800
pour le reste (`font-sans`). Les deux sont auto-hébergées depuis `public/fonts/` (les fichiers
de Google sous licence Open Font License, un `.woff2` par écriture ; Nunito est la police
variable, un seul fichier couvre 400–800) et déclarées en `@font-face` en tête de
`globals.css`, avec des polices de repli aux métriques alignées pour que rien ne bouge pendant
le chargement. Ne jamais ajouter de `<link>` vers Google Fonts.

**Formes** — cartes `rounded-[18px]` à `rounded-3xl`, boutons `rounded-full`, champs de
formulaire `rounded-[10px]`. Les cartes surélevées utilisent `shadow-lifted`
(`0 24px 48px -20px rgb(58 46 36 / 0.35)`).

**Largeur de contenu** — `max-w-[1200px] mx-auto px-6`, sections en `py-[72px]` (`py-14` sur
mobile). Les maquettes n'ont été dessinées qu'en 1280 px ; le comportement responsive (grilles
à 3 colonnes qui passent à 1 colonne sous `md`, menu burger de l'en-tête sous 1100 px) est
**ajouté** par cette implémentation — les prototypes ne le couvraient pas.

---

## Organisation du dépôt

```
project/                       Maquettes DC exportées (référence visuelle, non compilées)
chats/  README.md              Bundle de transfert Claude Design (ce que le client a demandé)
delivery/                      Docs client : guides d'installation (VPS, cPanel ; EN + FR), schema.sql
deploy/cpanel/                 .cpanel.yml + deploy.sh livrés sur la branche `deploy`
.github/workflows/             deploy-branch.yml : compile main → publie la branche `deploy`
Dockerfile                     Pour les hébergeurs à conteneurs (volume persistant sur /app/data)
server.mjs                     Point d'entrée production : charge .env, lance dist/server/entry.mjs
astro.config.mjs               Astro : rendu serveur, adaptateur Node, plugin Tailwind
src/
  pages/
    [locale]/index.astro       Page d'accueil
    [locale]/[...segments].astro   Toutes les autres pages publiques — voir « Routage »
    404.astro  sitemap.xml.ts  robots.txt.ts
    api/booking.ts             Envoi d'une demande de devis (JSON, ou formulaire classique)
    api/checkout.ts            Crée une session Stripe Checkout
    api/webhooks/stripe.ts     Confirmation du paiement (l'autorité sur « payé »)
    admin/                     Back-office protégé (anglais uniquement, non traduit)
      login.astro  logout.ts  index.astro  bookings/[id].astro
      rates.astro  packages.astro  settings.astro
  layouts/
    PublicLayout.astro         <head> avec toutes les balises SEO, lien d'évitement, bandeau cookies
    AdminLayout.astro          Coquille du back-office
  components/
    pages/                     Un composant serveur par page publique
    PriceCalculator.astro  BookingForm.astro  PricesTables.astro  DestinationSelect.astro
    SiteHeader.astro  SiteFooter.astro  CookieBanner.astro  HeroSlideshow.astro
    Button.astro  PageHero.astro  DarkCta.astro  PhotoPlaceholder.astro  …
    admin/Feedback.astro
  scripts/                     Scripts navigateur (TS vanilla, un par widget) :
    site.ts                    menus, sélecteur de langue, bandeau cookies, diaporama du hero
    calculator.ts  booking-form.ts  destination-select.ts  prices-tables.ts  admin.ts
  lib/
    prices.ts                  Grille tarifaire, véhicules, trajets, règle de nuit — données + calculs purs
    catalog.ts                 Forfaits et options — types purs + arithmétique pure
    calculator.ts              Modèle de vue du calculateur (partagé serveur + navigateur)
    estimate.ts                Estimation du formulaire, miroir de serverQuote() (partagé)
    i18n/                      Config des langues, segments d'URL traduits, 9 dictionnaires
    admin/actions.ts           Les opérations d'écriture du back-office
    admin/page.ts              Aide POST → redirection / retour pour les pages admin
    cache.ts                   Cache en mémoire des pages publiques rendues
    db.ts  booking.ts  mail.ts  auth.ts  settings.ts  stripe.ts  seo.ts  site.ts
  middleware.ts                Redirection de langue, cache de pages, en-têtes de sécurité
  styles/globals.css           Thème Tailwind (design tokens) + règles @font-face
public/fonts/                  Bree Serif + Nunito (variable) en .woff2, un par écriture
public/transfers/              Photos des trajets
data/app.db                    Base SQLite (ignorée par git, créée au premier lancement)
```

---

## Routage

Il n'y a que **deux** fichiers de pages publiques. `src/pages/[locale]/index.astro` rend la
page d'accueil ; tout le reste passe par `src/pages/[locale]/[...segments].astro`, qui fait
correspondre le segment d'URL à une clé de page grâce à la table `SEGMENTS`.

Cette indirection existe parce que les segments d'URL sont traduits par langue, ce qu'aucune
arborescence de dossiers ne peut exprimer : `/fr/tarifs`, `/en/prices` et `/es/precios` sont
la même page.

Pour ajouter une page :

1. ajouter sa clé à `PAGE_KEYS` et ses 9 segments à `SEGMENTS` (`src/lib/i18n/routes.ts`) ;
2. ajouter ses textes au type `Dictionary`, puis aux 9 dictionnaires ;
3. créer le composant serveur sous `src/components/pages/` ;
4. le brancher dans `[...segments].astro`. Le sitemap le prend en compte via `PAGE_KEYS`.

Toute combinaison langue/segment inexistante renvoie 404 — volontairement, pour que Google
ne voie jamais deux URL pour le même contenu. `src/pages/404.astro` est ce qu'Astro rend pour
chaque 404.

---

## Rendu, cache et SEO

- Chaque page est rendue **sur le serveur, à la demande**, en HTML complet
  (`output: 'server'`). Il n'y a pas de routage côté client : chaque lien est une
  navigation normale.
- Les pages publiques sont ensuite gardées dans un **cache en mémoire** (`src/lib/cache.ts`),
  indexé par chemin, et répondent donc depuis la mémoire comme des fichiers statiques.
  Chaque écriture admin qui change ce qu'une page affiche (tarifs, véhicules, forfaits,
  options, règle de nuit) appelle `invalidatePages()` ; une expiration d'une heure sert de
  filet de sécurité. Les pages avec une chaîne de requête ne sont jamais mises en cache — la
  page de réservation lit `?from=…` pour se pré-remplir et `?paid=1` au retour de Stripe.
  L'en-tête `X-Cache: HIT` / `MISS` de la réponse indique le cas.
- `PublicLayout.astro` émet, pour chaque page publique : `<title>`, `description`,
  `canonical`, `hreflang` × 9 + `x-default`, Open Graph, carte Twitter, `robots`. Les pages
  ajoutent du JSON-LD : `LocalBusiness` + `WebSite` (accueil), `Service` + `FAQPage` +
  `BreadcrumbList` (pages trajet), `FAQPage` (FAQ), `BreadcrumbList` (listes).
- `/sitemap.xml` liste les 270 URL (30 pages × 9 langues) avec les alternates `xhtml:link` ;
  `/robots.txt` exclut `/admin` et `/api`.
- Le prix par défaut du calculateur et **chaque tarif de chaque départ** de la page tarifs
  sont dans le HTML. Les pastilles de filtre et le calculateur ne font qu'afficher/masquer et
  mettre à jour ce qui est déjà là.

---

## i18n — 9 langues

`en` (défaut) · `fr` · `es` · `it` · `de` · `pt` · `ru` · `zh` · `ja`

- Chaque URL publique est préfixée par la langue. `middleware.ts` redirige `/prices` vers
  `/en/prices` selon un cookie, puis `Accept-Language`, puis l'anglais.
- **Les segments de page sont traduits** (`SEGMENTS`, source unique de vérité). C'est ce qui
  permet le référencement local.
- **Les slugs de trajet ne le sont pas** (`cdg-disneyland`, `orly-disneyland`…). Ce sont des
  noms propres, et les garder stables signifie une clé par liaison tarifée au lieu de neuf.
- Les dictionnaires sont des objets TypeScript typés par l'interface `Dictionary` : ajouter
  une clé casse la compilation dans les huit autres langues tant qu'elle n'est pas traduite.
  C'est voulu.
- **Les forfaits et options sont la seule exception.** Leurs noms et descriptions sont saisis
  par l'admin à l'exécution et affichés tels quels dans les neuf langues — une chaîne qui
  n'existe pas à la compilation ne peut pas être traduite. `dict.pricing.*` traduit les
  textes *autour* (titres, « Jusqu'à {pax} passagers », la note sur le tarif de nuit).
- `hreflang` + `x-default` sont générés pour chaque page par `pageMetadata()`
  (`src/lib/seo.ts`).
- Les pages légales (CGV, confidentialité, cookies) ont des URL traduites dans les neuf langues.
- Les scripts navigateur n'importent jamais de dictionnaire : les chaînes dont un widget a
  besoin sont sérialisées dans un `<script type="application/json">` à côté de lui (voir
  `labelsFromDictionary()` dans `src/lib/calculator.ts`).
- ⚠️ Les traductions autres que le français ont été écrites par un assistant et **n'ont pas
  été relues par un locuteur natif**. Faire vérifier DE / PT / RU / 中文 / 日本語 avant le
  lancement — y compris le bloc `pricing` ajouté pour les forfaits, les options et le
  supplément de nuit.

---

## Grille tarifaire

Source unique de vérité : `src/lib/prices.ts` (portée depuis `project/prices.js`).

- 20 liaisons, prix aller simple en €, par palier de passagers `[1-3, 4, 5, 6, 7, 8]`.
- La grille est **symétrique** : `cdg-disney` sert aussi Disney → CDG.
- Aller-retour = ×2.
- Véhicules : berline (×1, 4 pax), SUV (×1,1, 4 pax), van (×1, 8 pax),
  Mercedes premium (×1,5, 3 pax). L'admin peut masquer un véhicule et changer son
  coefficient sur `/admin/rates` (stocké dans `settings.vehicles`).
- Une liaison absente de la grille signifie « sur devis, réponse sous 2 h » — le site
  n'invente jamais de prix.
- L'admin édite les prix en base sous forme de **six cases par ligne** ; `prices.ts` ne sert
  qu'à initialiser les valeurs par défaut au premier démarrage (`seedRates()` dans
  `src/lib/db.ts`). Lire la grille vivante avec `getRates()`, jamais `RATES` directement, en
  dehors de cette initialisation.
- Lire la flotte vivante avec `getVehicleFleet()`, jamais `VEHICLES` directement, en dehors
  de cette initialisation / du repli côté client.

**Les prix hors CDG ont été estimés pendant la phase de design et doivent être validés par le
client.**

Les montants sont stockés en **centimes** (`quoted_price_cents`, `paid_amount_cents`) pour
éviter les arrondis flottants ; la grille elle-même est en euros entiers.

---

## De quoi est fait un prix

Trois couches, toutes pilotées par l'admin, composées dans cet ordre :

```
  base        grille × coefficient véhicule × trajet   (ou le prix fixe d'un forfait)
+ nuit        base × nightSurchargePercent, si l'heure de prise en charge est dans les heures de nuit
+ options     les options payantes choisies, jamais majorées de nuit
= quoted_price_cents
```

- **Les forfaits** (table `packages`) remplacent entièrement le tarif : une réservation avec
  forfait ignore la grille, le coefficient véhicule et le doublement aller-retour. Le
  `night_surcharge` propre à chaque forfait décide si le supplément s'applique par-dessus.
- **La règle de nuit** est une fenêtre globale plus un pourcentage (`settings`). Une fenêtre
  dont la fin est avant ou égale au début passe minuit — 21:00 → 06:00 est le cas normal, et
  `isNightTime()` le gère. `end` est exclusif : une fenêtre 22:00–05:30 majore 05:29 et pas
  05:30. Sans heure de prise en charge, le supplément ne s'applique jamais.
- **Les options** (table `extras`) sont forfaitaires ou à l'unité, plafonnées par `max_qty`,
  et toujours facturées à leur valeur faciale.

`quoteBreakdown()` / `applyNight()` dans `prices.ts` et `priceExtras()` dans `catalog.ts`
sont purs et utilisables côté client ; `serverQuote()` dans `booking.ts` est ce qui décide
réellement du prix. **`computeEstimate()` dans `src/lib/estimate.ts` reflète `serverQuote()`
volontairement** — il rend l'estimation de la page de réservation sur le serveur *et* la
recalcule dans le navigateur — pour que le visiteur voie le même chiffre que celui que le
serveur enregistrera. Si vous changez l'un, changez l'autre, sinon l'estimation et l'e-mail de
confirmation ne seront plus d'accord.

Une réservation fige sa propre décomposition (`base_price_cents`, `night_surcharge_cents`,
`extras_price_cents`, `package_name`, `extras_json`). Modifier un forfait ou une option plus
tard ne doit jamais réécrire ce qui a été proposé à un client existant — c'est pourquoi le
libellé et le prix unitaire sont copiés sur la réservation plutôt que référencés.

---

## Variables d'environnement

Voir `.env.example`. Aucun secret n'est jamais commité.

```
APP_URL=https://disneyparistransfers.com
SESSION_SECRET=            # 32+ caractères aléatoires, obligatoire
ADMIN_EMAIL=               # identifiant admin
ADMIN_PASSWORD_HASH=       # via `npm run admin:hash -- 'mot-de-passe'`
SMTP_HOST= SMTP_PORT= SMTP_USER= SMTP_PASS= SMTP_SECURE=
MAIL_FROM="Disney Paris Transfers <contact@disneyparistransfers.com>"
MAIL_TO=                   # où arrivent les demandes de devis
STRIPE_SECRET_KEY=         # optionnel — aussi collable depuis Admin → Settings
STRIPE_WEBHOOK_SECRET=
SITE_PHONE=+33781662122    # (les anciens noms NEXT_PUBLIC_* fonctionnent encore en repli)
SITE_PHONE_DISPLAY="07 81 66 21 22"
SITE_WHATSAPP=33781662122
SITE_EMAIL=contact@disneyparistransfers.com
PORT=3000  HOST=0.0.0.0    # optionnel
```

Chaque variable est lue dans `process.env` **au moment de la requête** : rien n'est figé
dans le build, donc changer le numéro de téléphone revient à éditer `.env` et redémarrer,
pas à recompiler. `server.mjs` charge lui-même `.env` en production (pas de dépendance
dotenv, pas d'expansion de `$`) ; `astro.config.mjs` fait de même pour `npm run dev` et
`npm run build`.

Les clés Stripe, le SMTP et le mot de passe admin peuvent aussi être enregistrés depuis
**Admin → Settings**. Les valeurs en base priment sur `.env` sans redémarrage. Les
formulaires ne réaffichent jamais le secret complet — seulement un indice `••••abcd`.
`SESSION_SECRET` et `ADMIN_EMAIL` restent dans `.env`.

Sans hôte SMTP (ni admin ni `SMTP_HOST`), les e-mails sont écrits dans la console : le site
reste utilisable en développement et les réservations sont bien enregistrées.

⚠️ `ADMIN_PASSWORD_HASH` utilise `:` comme séparateur (`scrypt:sel:hash`), **pas** `$`. Les
chargeurs de type dotenv développent `$nom` comme une variable et tronqueraient
silencieusement le hash.

---

## Déploiement

Trois voies prises en charge, toutes documentées pour le client dans `delivery/` :

- **VPS** (`GUIDE-INSTALLATION.md`) : `npm ci && npm run build`, puis `npm start` sous pm2
  derrière nginx.
- **Hébergement mutualisé avec un panneau « application Node.js »** — o2switch, cPanel,
  Plesk (`DEPLOIEMENT-CPANEL.md`) : le site est **compilé par GitHub, pas par
  l'hébergeur**. `.github/workflows/deploy-branch.yml` compile à chaque push sur `main` et
  pousse (en force) une branche `deploy` prête à l'emploi (`dist/`, `server.mjs`,
  `package*.json`, `scripts/`, plus `deploy/cpanel/.cpanel.yml` et `deploy.sh`). L'outil
  Git de cPanel récupère cette branche dans la racine de l'application ; `deploy.sh` active
  le Node propre à l'application, lance `npm ci --omit=dev` et touche `tmp/restart.txt`
  pour Passenger. Passenger ignore le port sur lequel `server.mjs` écoute et route le
  domaine lui-même. Placer `DATABASE_PATH` hors du dépôt pour qu'une mise à jour ne touche
  jamais les réservations.
- **Hébergeurs à conteneurs** (Render, Railway, Coolify…) : le `Dockerfile` à la racine ;
  monter un volume persistant sur `/app/data`.

Dans tous les cas : Node **22.12+**, un seul processus, et les variables de `.env.example`
(ou celles du panneau — `server.mjs` ne remplit que ce qui n'est pas déjà défini).

---

## Commandes

```bash
npm run dev          # serveur de développement (http://localhost:3000)
npm run build        # build de production → dist/
npm start            # serveur de production (node server.mjs, lit .env, port 3000)
npm run check        # astro check — TypeScript sur les fichiers .astro et .ts
npm run lint         # ESLint
npm run admin:hash   # générer un ADMIN_PASSWORD_HASH
```

---

## Conventions

- **Le HTML d'abord.** Une page doit être complète et correcte avant qu'un script ne
  s'exécute : le calculateur affiche le prix par défaut, la page tarifs affiche toutes les
  grilles, le formulaire de réservation s'envoie comme un formulaire classique. Les scripts
  navigateur ne font qu'*enrichir* — ils ne rendent jamais un contenu qui n'est pas déjà
  dans le HTML.
- **Un script par widget**, dans `src/scripts/`, importé depuis le composant par une balise
  `<script>`. Astro les regroupe et les dédoublonne. Un script commence par
  `document.querySelectorAll('[data-…]')` et tolère l'absence de son balisage, puisqu'un même
  bundle sert plusieurs pages.
- **Calculs partagés, une seule implémentation.** Tout ce qui est calculé à la fois sur le
  serveur et dans le navigateur vit dans un module pur (`calculator.ts`, `estimate.ts`)
  importé des deux côtés. Ces modules ne touchent jamais `process.env` ni la base.
- Les prix montrés au visiteur sont **toujours recalculés côté serveur** avant toute
  persistance ou tout débit. Ne jamais faire confiance à un montant envoyé par le navigateur.
- **Les formulaires admin sont de simples formulaires HTML** postés vers la page elle-même.
  Un enregistrement réussi répond par une redirection (`?saved=…`) pour qu'un rafraîchissement
  ne renvoie jamais le formulaire ; une erreur rerend la page avec les valeurs saisies et le
  message à côté du formulaire (`src/lib/admin/page.ts`).
- Chaque chaîne visible passe par le dictionnaire — aucun texte en dur dans un composant.
  Deux exceptions : l'admin (anglais uniquement), et les noms de forfaits / options, saisis
  par l'admin.
- Numéro de téléphone, WhatsApp et e-mail viennent des variables d'environnement, jamais en dur.
- Conserver le disclaimer issu du design, dans toutes les langues : *« Service indépendant,
  non affilié à The Walt Disney Company. »*
- Le modificateur important de Tailwind est la forme **suffixe** de la v4 (`px-7!`), utilisée
  seulement pour ajuster un `Button` sur une page donnée.

---

## À savoir avant de modifier quelque chose

- **`data/` est toute l'activité.** Un seul fichier SQLite contient toutes les réservations.
  Tout changement de déploiement qui ne le préserve pas perd des données clients.
- **Le webhook Stripe est l'autorité sur le paiement**, pas la redirection du navigateur. Un
  client qui ferme l'onglet après avoir payé doit quand même finir marqué comme payé.
- **Le honeypot répond `200`.** `website` est accepté par le schéma et silencieusement ignoré
  dans la route, pour qu'un robot n'apprenne rien de la réponse.
- **Astro vérifie l'en-tête `Origin` sur les envois de formulaires** (protection CSRF
  intégrée) : un POST `application/x-www-form-urlencoded` sans `Origin` correspondant reçoit
  un 403. Les navigateurs l'envoient toujours ; `curl` non — ajouter `-H 'Origin: …'` pour
  tester l'admin ou le formulaire sans JavaScript à la main. Les POST JSON (le script de
  réservation, le webhook Stripe) n'y sont pas soumis.
- **La limitation de débit est en mémoire** (`src/lib/ratelimit.ts`). Elle se remet à zéro
  au redémarrage, ce qui suffit contre le spam mais n'est pas une frontière de sécurité.
  Derrière plusieurs processus Node, la déplacer en base ou dans un store partagé. Elle est
  indexée sur `x-forwarded-for` : `/api/booking` accepte 5 requêtes par IP par 10 minutes — à
  savoir quand on teste à la main.
- **Le cache de pages est en mémoire lui aussi.** Derrière plusieurs processus Node, chacun
  garde sa copie ; une écriture admin n'invalide que le processus qui l'a traitée, les autres
  expirent dans l'heure. Lancer un seul processus (pm2 en mode `fork`), ou retirer le cache,
  si cela compte.
- **Les nouvelles colonnes demandent un `ALTER TABLE` gardé.** SQLite n'a pas de
  `ADD COLUMN IF NOT EXISTS`, donc `addColumns()` dans `db.ts` vérifie d'abord `table_info`.
  Un `data/app.db` existant en production doit survivre à chaque mise à jour.
- **`berline` a été renommé `saloon`** lors du passage du code en anglais. `addColumns()`
  migre les anciennes lignes, et l'admin comme les gabarits d'e-mail se rabattent sur l'id
  brut plutôt que de planter sur un véhicule inconnu.
- **`Response.redirect()` a des en-têtes immuables.** Le middleware copie une telle réponse
  avant d'ajouter les en-têtes de sécurité ; préférer de toute façon
  `new Response(null, { status: 303, headers })` ou `Astro.redirect()`.
