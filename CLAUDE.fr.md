# CLAUDE.md — Disney Paris Transfers

> **La version anglaise (`CLAUDE.md`) fait foi** — c'est celle que lisent les agents de
> code. Ce document en est la traduction française, à l'intention du client. Si vous
> modifiez l'un, modifiez l'autre.
>
> Le code est **entièrement en anglais** — identifiants, commentaires, espace de gestion.
> Le site public reste multilingue, avec l'**anglais comme langue par défaut**.

Site de chauffeur privé VTC (`disneyparistransfers.com`) spécialisé dans les transferts
entre les aéroports parisiens (CDG, Orly, Beauvais), Paris et Disneyland Paris.

Ce dépôt implémente les maquettes exportées depuis Claude Design (dossier `project/`, laissé
intact avec le `README.md` et les `chats/` du bundle de handoff).
**Les maquettes font foi pour le visuel.** Toute divergence de couleur, d'espacement ou de
typographie par rapport à `project/*.dc.html` est un bug.

---

## Stack

| Couche | Choix |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, TypeScript strict) |
| Styles | Tailwind CSS v4 (config par CSS, `src/app/globals.css`) |
| Base de données | SQLite via `better-sqlite3` (fichier `data/app.db`) |
| Emails | SMTP classique via `nodemailer` |
| Paiement | Stripe Checkout — **activable/désactivable depuis l'admin** |
| Auth admin | Session cookie signée HMAC + mot de passe `scrypt` (aucune dépendance externe) |
| Validation | `zod` sur toutes les entrées d'API |

Hébergement visé : serveur Node classique (OVH, Gandi, VPS…), pas de plateforme serverless —
la base SQLite et l'envoi SMTP supposent un système de fichiers et un process persistants.

---

## Design tokens

Repris à l'identique des maquettes. **Ne pas inventer de nouvelles couleurs.**

| Rôle | Hex | Utilitaire Tailwind |
| --- | --- | --- |
| Fond crème (page) | `#FBF6ED` | `bg-cream` |
| Fond sable (sections) | `#F6E9D8` | `bg-sand` |
| Surface / cartes | `#FFFDF9` | `bg-surface` |
| Bordure | `#EBDFC9` | `border-line` |
| Terracotta (accent, CTA) | `#B4552D` | `text-brand` / `bg-brand` |
| Terracotta foncé (hover) | `#8F3F1E` | `bg-brand-dark` |
| Brun profond (texte, footer) | `#3A2E24` | `text-ink` / `bg-ink` |
| Brun moyen (texte courant) | `#6B5641` | `text-ink-soft` |
| Brun clair (texte tertiaire) | `#8F7455` | `text-ink-mute` |
| Beige texte sur fond brun | `#C9B79E` | `text-cream-soft` |
| Or (CTA sur fond brun) | `#D9A441` | `bg-gold` |
| Or foncé (hover) | `#C4902F` | `bg-gold-dark` |
| Vert WhatsApp (fond clair) | `#E8F0DC` | `bg-whatsapp` |

**Typographie** — `Bree Serif` pour tous les titres (`font-display`), `Nunito` 400/600/700/800
pour le reste (`font-sans`). Chargées via `next/font/google`, pas de `<link>` vers Google Fonts.

**Formes** — cartes `rounded-[18px]` à `rounded-3xl`, boutons `rounded-full`,
champs de formulaire `rounded-[10px]`. Ombre portée des cartes en relief :
`shadow-[0_24px_48px_-20px_rgba(58,46,36,.35)]`.

**Largeur de contenu** — `max-w-[1200px] mx-auto px-6`, sections en `py-[72px]`
(`py-14` sur mobile). Les maquettes sont dessinées en 1280px de large ; le responsive
(passage des grilles 3 colonnes en 1 colonne sous `md`) est **ajouté** par l'implémentation,
les prototypes ne le couvraient pas.

---

## Arborescence

```
project/                       Maquettes DC exportées (référence visuelle, non compilées)
chats/  README.md              Bundle de handoff Claude Design (intention du client)
delivery/                     Docs client : guide d'installation (FR + EN), schema.sql,
                              et DEVELOPER-HANDOFF.pdf (+ sa source .html)
src/
  app/
    [locale]/
      page.tsx                 Accueil (+ calculateur de prix)
      [...segments]/page.tsx   Toutes les autres pages publiques — voir « Routage »
    admin/                     Espace protégé (anglais uniquement, non traduit)
      actions.ts               Actions serveur : connexion, demandes, tarifs,
                               forfaits, réglages
      bookings/[id]/           Fiche d'une demande + détail du calcul du prix
      rates/                   Éditeur de la grille tarifaire
      packages/                Forfaits et options payantes (CRUD)
      settings/                Horaires de nuit + supplément, interrupteur Stripe
    api/
      booking/                 Réception des demandes de devis
      checkout/                Ouverture d'une session Stripe Checkout
      webhooks/stripe/         Confirmation de paiement (fait foi sur « payé »)
    sitemap.ts  robots.ts
  components/
    pages/                     Un composant serveur par page publique
    PriceCalculator.tsx  BookingForm.tsx  PricesTables.tsx   ("use client")
    SiteHeader.tsx  SiteFooter.tsx  ui.tsx
  lib/
    prices.ts                  Grille tarifaire, véhicules, trajets, règle de nuit
    catalog.ts                 Forfaits et options — types purs + arithmétique pure
    i18n/                      Langues, segments d'URL traduits, 7 dictionnaires
    db.ts  booking.ts  mail.ts  auth.ts  settings.ts  stripe.ts  seo.ts  site.ts
  middleware.ts                Redirige les URL sans préfixe vers la bonne langue
data/app.db                    Base SQLite (git-ignorée, créée au premier lancement)
```

---

## Routage

Il n'existe que **deux** fichiers de page publique. `src/app/[locale]/page.tsx` rend
l'accueil ; tout le reste passe par `src/app/[locale]/[...segments]/page.tsx`, qui retrouve
la page à partir du segment d'URL grâce à la table `SEGMENTS`.

Cette indirection existe parce que les segments sont traduits par langue, ce qu'aucune
arborescence de dossiers ne sait exprimer : `/fr/tarifs`, `/en/prices` et `/es/precios`
désignent la même page.

Toute combinaison langue/segment inexistante renvoie un 404 — volontairement, pour que
Google ne voie jamais deux adresses pour un même contenu.

---

## i18n — 9 langues

`en` (défaut) · `fr` · `es` · `it` · `de` · `pt` · `ru` · `zh` · `ja`

- Chaque URL publique est préfixée par la langue : `/en/prices`, `/fr/tarifs`, `/es/precios`, `/de/preise`, `/pt/precos`…
  `middleware.ts` redirige une URL sans préfixe d'après le cookie, puis `Accept-Language`,
  puis l'anglais.
- Les **segments de page sont traduits** (table `SEGMENTS` dans `src/lib/i18n/routes.ts`,
  source unique de vérité) — c'est ce qui fait le référencement local. Ne jamais servir un
  segment français sous `/ja/` : `src/app/[locale]/[...segments]/page.tsx` renvoie un 404
  pour toute combinaison langue/segment incohérente.
- Les **slugs de trajet** (`cdg-disneyland`…) sont en revanche identiques dans toutes les
  langues : ce sont des noms propres, et cela garde une seule clé par liaison tarifaire.
- Les dictionnaires sont des objets TypeScript typés d'après `Dictionary` : ajouter une clé
  provoque une erreur de compilation dans les 8 autres langues tant qu'elle n'est pas traduite.
  C'est voulu.
- **Les forfaits et les options font exception.** Leurs noms et descriptions sont saisis par
  l'admin à l'exécution et affichés tels quels dans les 9 langues — on ne peut pas traduire
  une chaîne qui n'existe pas encore à la compilation. `dict.pricing.*` traduit le texte
  *autour* d'eux (titres, « Jusqu'à {pax} passagers », la mention du tarif de nuit).
- `hreflang` + `x-default` générés automatiquement dans chaque `layout`/`page`.
- Pages légales (CGV, confidentialité, cookies) avec URL traduites dans les 9 langues.
- ⚠️ Les traductions non-FR ont été rédigées par l'assistant et **n'ont pas été relues par un
  locuteur natif**. À faire vérifier avant mise en production, en particulier DE / PT / RU / 中文 / 日本語.

---

## Grille tarifaire

Source unique : `src/lib/prices.ts` (porté depuis `project/prices.js`).

- 20 liaisons, prix aller simple en €, par palier de passagers `[1-3, 4, 5, 6, 7, 8]`.
- Aller-retour = ×2.
- Véhicules : Berline — identifiant `saloon` (×1, 4 pax), SUV (×1,1, 4 pax),
  Van (×1, 8 pax), Premium Mercedes (×1,5, 3 pax). L'admin peut masquer un véhicule et
  changer son multiplicateur sur `/admin/rates` (stocké dans `settings.vehicles`).
- Une liaison absente de la grille ⇒ « sur devis, réponse sous 2 h », jamais un prix inventé.
- L'admin modifie les prix en base **six cases par ligne** ; `prices.ts` ne sert que de
  valeurs par défaut au premier démarrage (`seedRates()` dans `src/lib/db.ts`). Lire la
  grille avec `getRates()`, jamais `RATES` directement en dehors de ce peuplement initial.
- Lire la flotte avec `getVehicleFleet()`, jamais `VEHICLES` directement hors de ce
  peuplement / du repli côté client.

**Les prix hors CDG ont été estimés lors du design et doivent être validés par le client.**

Les montants sont stockés en **centimes** (`quoted_price_cents`, `paid_amount_cents`) pour
éviter les arrondis ; la grille elle-même est en euros entiers.

---

## De quoi un prix est fait

Trois couches, toutes pilotées depuis l'admin, composées dans cet ordre :

```
  base        la grille x le multiplicateur du véhicule x le trajet
              (ou le prix fixe d'un forfait)
+ nuit        base x nightSurchargePercent, si l'heure de prise en charge
              tombe dans les horaires de nuit
+ options     les options payantes choisies, jamais majorées la nuit
= quoted_price_cents
```

- **Les forfaits** (table `packages`) remplacent entièrement la course : une demande avec
  forfait ignore la grille, le multiplicateur de véhicule et le doublement aller-retour. Le
  champ `night_surcharge` de chaque forfait décide si le supplément s'y applique.
- **La règle de nuit** est une plage horaire globale et un pourcentage (`settings`). Une
  plage dont la fin est antérieure ou égale au début passe minuit — 21:00 -> 06:00 est le cas
  normal, et `isNightTime()` le gère. La fin est exclue : une plage 22:00–05:30 majore 05:29
  mais pas 05:30. Sans heure de prise en charge, le supplément ne s'applique jamais.
- **Les options** (table `extras`) sont forfaitaires ou à l'unité, plafonnées par `max_qty`,
  et toujours facturées à leur valeur faciale.

`quoteBreakdown()` / `applyNight()` dans `prices.ts` et `priceExtras()` dans `catalog.ts`
sont purs et utilisables côté client ; `serverQuote()` dans `booking.ts` est ce qui décide
réellement du prix. **`BookingForm` reproduit `serverQuote()` volontairement** pour que le
visiteur voie le montant que le serveur enregistrera — si vous modifiez l'un, modifiez
l'autre, sinon l'estimation et l'email de confirmation ne diront pas la même chose.

Une demande fige son propre détail (`base_price_cents`, `night_surcharge_cents`,
`extras_price_cents`, `package_name`, `extras_json`). Modifier un forfait ou une option plus
tard ne doit jamais réécrire ce qui a été annoncé à un client existant — c'est pourquoi le
libellé et le prix unitaire sont recopiés sur la demande plutôt que référencés.

---

## Variables d'environnement

Voir `.env.example`. Aucune valeur secrète n'est commitée.

```
APP_URL=https://disneyparistransfers.com
SESSION_SECRET=            # 32+ caractères aléatoires, obligatoire
ADMIN_EMAIL=               # identifiant de connexion admin
ADMIN_PASSWORD_HASH=       # généré par `npm run admin:hash -- 'motdepasse'`
SMTP_HOST= SMTP_PORT= SMTP_USER= SMTP_PASS= SMTP_SECURE=
MAIL_FROM="Disney Paris Transfers <contact@disneyparistransfers.com>"
MAIL_TO=                   # destinataire des demandes de devis
STRIPE_SECRET_KEY=         # optionnel — aussi collable depuis Admin → Settings
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_PHONE=+33781662122
NEXT_PUBLIC_WHATSAPP=33781662122
```

Les clés Stripe, le SMTP et le mot de passe admin peuvent aussi se saisir depuis
**Admin → Settings**. Les valeurs en base priment sur le `.env`, sans redémarrage. Les
formulaires ne réaffichent jamais le secret en clair, seulement un indice `••••abcd`.
`SESSION_SECRET` et `ADMIN_EMAIL` restent dans le `.env`.

Sans hôte SMTP (ni admin ni `SMTP_HOST`), l'envoi bascule en mode « log console » : le site
reste fonctionnel en développement et les demandes sont quand même enregistrées en base.

⚠️ `ADMIN_PASSWORD_HASH` utilise `:` comme séparateur (`scrypt:sel:empreinte`), et **non**
`$` : dotenv interpréterait `$xxx` comme une variable et tronquerait silencieusement
l'empreinte.

---

## Commandes

```bash
npm run dev          # développement (http://localhost:3000)
npm run build        # build de production
npm start            # serveur de production
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run admin:hash   # génère un ADMIN_PASSWORD_HASH
```

---

## Conventions

- **Server Components par défaut.** `"use client"` uniquement pour l'interactif :
  calculateur de prix, sélecteur de langue, popover téléphone, formulaire, écrans admin.
- Les prix affichés au client sont **toujours recalculés côté serveur** avant enregistrement
  ou paiement — ne jamais faire confiance au montant envoyé par le navigateur.
- Les formulaires de l'admin utilisent des **champs contrôlés** : React 19 réinitialise les
  champs non contrôlés après une action serveur, ce qui afficherait d'anciennes valeurs juste
  après un enregistrement réussi.
- Tout texte visible passe par le dictionnaire, jamais de chaîne en dur dans un composant.
  Deux exceptions : l'espace de gestion (EN uniquement) et les noms de forfaits et
  d'options, saisis par l'admin.
- Le numéro de téléphone et le WhatsApp viennent des variables d'env, jamais codés en dur.
- Mentions obligatoires conservées du design : « Service indépendant, non affilié à
  The Walt Disney Company. » dans le footer, sur toutes les langues.
- SEO : chaque page publique définit `title`, `description`, `canonical`, `alternates`.
  L'accueil et les pages trajet portent un JSON-LD (`LocalBusiness`, `Service`, `FAQPage`).
- Les pages publiques sont statiques avec `revalidate = 3600` ; les écritures de l'admin
  appellent `revalidatePath('/', 'layout')` pour qu'un changement de prix soit visible
  immédiatement.

---

## À savoir avant de modifier quoi que ce soit

- **`data/` contient toute l'activité.** Un seul fichier SQLite porte l'ensemble des
  réservations. Tout changement de déploiement qui ne le préserve pas perd les données
  clients.
- **C'est le webhook Stripe qui fait foi sur le paiement**, pas la redirection du navigateur :
  un client qui ferme son onglet après avoir payé doit quand même être marqué payé.
- **Le champ piège répond `200`.** `website` est accepté par le schéma puis ignoré dans la
  route : le robot n'apprend rien de la réponse.
- **La limitation de débit est en mémoire** (`src/lib/ratelimit.ts`). Elle se remet à zéro au
  redémarrage, ce qui convient à de l'anti-spam mais n'est pas une barrière de sécurité. Avec
  plusieurs processus Node, la déplacer en base ou dans un stockage partagé. Elle est indexée
  sur `x-forwarded-for` : `/api/booking` accepte 5 requêtes par IP et par 10 minutes — bon à
  savoir pour les tests manuels.
- **Une nouvelle colonne exige un `ALTER TABLE` protégé.** SQLite n'a pas de
  `ADD COLUMN IF NOT EXISTS` : `addColumns()` dans `db.ts` vérifie d'abord `table_info`. Un
  `data/app.db` existant en production doit survivre à chaque mise à jour.
- **`berline` a été renommé `saloon`** au passage du code à l'anglais. `addColumns()` migre
  les anciennes lignes, et l'admin comme les emails retombent sur l'identifiant brut plutôt
  que de planter sur un véhicule inconnu.
